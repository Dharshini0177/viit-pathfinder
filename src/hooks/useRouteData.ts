import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface Location {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  type: string;
}

interface RouteCoordinate {
  latitude: number;
  longitude: number;
  sequence_order: number;
}

interface RouteData {
  id: string;
  route_name: string;
  description: string;
  distance: number;
  estimated_time: number;
  difficulty: string;
  start_location: Location;
  end_location: Location;
  coordinates: RouteCoordinate[];
  waypoints: Array<{
    location: Location;
    instruction: string;
    sequence_order: number;
  }>;
}

export const useRouteData = (routeName: string) => {
  return useQuery({
    queryKey: ["route", routeName],
    queryFn: async (): Promise<RouteData | null> => {
      // Fetch route by name
      const { data: route, error: routeError } = await supabase
        .from("routes")
        .select(
          `
          id,
          route_name,
          description,
          distance,
          estimated_time,
          difficulty,
          start_location:start_location_id (
            id,
            name,
            latitude,
            longitude,
            type
          ),
          end_location:end_location_id (
            id,
            name,
            latitude,
            longitude,
            type
          )
        `
        )
        .eq("route_name", routeName)
        .single();

      if (routeError || !route) {
        console.error("Error fetching route:", routeError);
        return null;
      }

      // Fetch coordinates
      const { data: coordinates, error: coordError } = await supabase
        .from("route_coordinates")
        .select("latitude, longitude, sequence_order")
        .eq("route_id", route.id)
        .order("sequence_order", { ascending: true });

      if (coordError) {
        console.error("Error fetching coordinates:", coordError);
      }

      // Fetch waypoints
      const { data: waypoints, error: waypointError } = await supabase
        .from("waypoints")
        .select(
          `
          instruction,
          sequence_order,
          location:location_id (
            id,
            name,
            latitude,
            longitude,
            type
          )
        `
        )
        .eq("route_id", route.id)
        .order("sequence_order", { ascending: true });

      if (waypointError) {
        console.error("Error fetching waypoints:", waypointError);
      }

      return {
        id: route.id,
        route_name: route.route_name,
        description: route.description,
        distance: Number(route.distance),
        estimated_time: route.estimated_time,
        difficulty: route.difficulty,
        start_location: route.start_location as unknown as Location,
        end_location: route.end_location as unknown as Location,
        coordinates: (coordinates || []).map((c) => ({
          latitude: Number(c.latitude),
          longitude: Number(c.longitude),
          sequence_order: c.sequence_order,
        })),
        waypoints: (waypoints || []).map((w) => ({
          location: w.location as unknown as Location,
          instruction: w.instruction || "",
          sequence_order: w.sequence_order,
        })),
      };
    },
  });
};
