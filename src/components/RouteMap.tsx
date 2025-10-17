import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";

// Mapbox token configuration
const MAPBOX_TOKEN_STORAGE_KEY = "mapbox_token";

interface RouteMapProps {
  routeCoordinates: Array<{ latitude: number; longitude: number }>;
  startLocation: { name: string; latitude: number; longitude: number };
  endLocation: { name: string; latitude: number; longitude: number };
  waypoints?: Array<{ name: string; latitude: number; longitude: number }>;
}

const RouteMap = ({ routeCoordinates, startLocation, endLocation, waypoints = [] }: RouteMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapboxToken, setMapboxToken] = useState<string>("");
  const [tokenInput, setTokenInput] = useState<string>("");
  const [isTokenSet, setIsTokenSet] = useState<boolean>(false);

  // Check for stored token on mount
  useEffect(() => {
    const storedToken = localStorage.getItem(MAPBOX_TOKEN_STORAGE_KEY);
    if (storedToken) {
      setMapboxToken(storedToken);
      setIsTokenSet(true);
    }
  }, []);

  // Initialize map when token is available
  useEffect(() => {
    if (!mapContainer.current || !mapboxToken || map.current) return;

    mapboxgl.accessToken = mapboxToken;

    // Calculate center point from route coordinates
    const centerLat = routeCoordinates.reduce((sum, coord) => sum + coord.latitude, 0) / routeCoordinates.length;
    const centerLng = routeCoordinates.reduce((sum, coord) => sum + coord.longitude, 0) / routeCoordinates.length;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [centerLng, centerLat],
      zoom: 15,
    });

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl(), "top-right");

    // Add markers and route line when map loads
    map.current.on("load", () => {
      if (!map.current) return;

      // Add start marker
      new mapboxgl.Marker({ color: "#10b981" })
        .setLngLat([startLocation.longitude, startLocation.latitude])
        .setPopup(new mapboxgl.Popup().setHTML(`<strong>Start:</strong> ${startLocation.name}`))
        .addTo(map.current);

      // Add end marker
      new mapboxgl.Marker({ color: "#3b82f6" })
        .setLngLat([endLocation.longitude, endLocation.latitude])
        .setPopup(new mapboxgl.Popup().setHTML(`<strong>End:</strong> ${endLocation.name}`))
        .addTo(map.current);

      // Add waypoint markers
      waypoints.forEach((waypoint) => {
        new mapboxgl.Marker({ color: "#f59e0b", scale: 0.8 })
          .setLngLat([waypoint.longitude, waypoint.latitude])
          .setPopup(new mapboxgl.Popup().setHTML(`<strong>Waypoint:</strong> ${waypoint.name}`))
          .addTo(map.current!);
      });

      // Add route line
      if (routeCoordinates.length > 0) {
        map.current.addSource("route", {
          type: "geojson",
          data: {
            type: "Feature",
            properties: {},
            geometry: {
              type: "LineString",
              coordinates: routeCoordinates.map((coord) => [coord.longitude, coord.latitude]),
            },
          },
        });

        map.current.addLayer({
          id: "route",
          type: "line",
          source: "route",
          layout: {
            "line-join": "round",
            "line-cap": "round",
          },
          paint: {
            "line-color": "#3b82f6",
            "line-width": 4,
            "line-opacity": 0.75,
          },
        });
      }

      // Fit bounds to show entire route
      if (routeCoordinates.length > 0) {
        const bounds = new mapboxgl.LngLatBounds();
        routeCoordinates.forEach((coord) => {
          bounds.extend([coord.longitude, coord.latitude]);
        });
        map.current.fitBounds(bounds, { padding: 50 });
      }
    });

    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, [mapboxToken, routeCoordinates, startLocation, endLocation, waypoints]);

  const handleSaveToken = () => {
    if (tokenInput.trim()) {
      localStorage.setItem(MAPBOX_TOKEN_STORAGE_KEY, tokenInput.trim());
      setMapboxToken(tokenInput.trim());
      setIsTokenSet(true);
    }
  };

  if (!isTokenSet) {
    return (
      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <MapPin className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold">Setup Map View</h3>
          </div>
          <p className="text-sm text-muted-foreground">
            To display the interactive route map, please enter your Mapbox public token.
          </p>
          <div className="space-y-2">
            <Label htmlFor="mapbox-token">Mapbox Public Token</Label>
            <Input
              id="mapbox-token"
              type="text"
              placeholder="pk.eyJ1..."
              value={tokenInput}
              onChange={(e) => setTokenInput(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Get your free token at{" "}
              <a
                href="https://account.mapbox.com/access-tokens/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                mapbox.com
              </a>
            </p>
          </div>
          <Button onClick={handleSaveToken} className="w-full">
            Save Token & Show Map
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <div className="relative w-full h-[500px] rounded-lg overflow-hidden shadow-lg border border-border">
      <div ref={mapContainer} className="absolute inset-0" />
    </div>
  );
};

export default RouteMap;
