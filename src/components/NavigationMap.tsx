import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-polylinedecorator";

// Fix default marker icons
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

const DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

interface RouteFeature {
  type: string;
  properties: {
    name: string;
    category: string;
    description?: string;
  };
  geometry: {
    type: string;
    coordinates: number[][];
  };
}

interface NavigationMapProps {
  routeData: RouteFeature;
  allRoutes: RouteFeature[];
  isPlaying: boolean;
  onStepChange: (step: number) => void;
  activeStep: number;
}

const categoryColors: Record<string, string> = {
  academic: "#3b82f6",
  hostel: "#10b981",
  religious: "#f97316",
  events: "#a855f7",
  general: "#6b7280",
};

const NavigationMap = ({
  routeData,
  allRoutes,
  isPlaying,
  onStepChange,
  activeStep,
}: NavigationMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<L.Map | null>(null);
  const currentPolyline = useRef<L.Polyline | null>(null);
  const movingMarker = useRef<L.Marker | null>(null);
  const animationFrame = useRef<number | null>(null);
  const [progress, setProgress] = useState(0);

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    // Create map
    map.current = L.map(mapContainer.current, {
      center: [18.4574, 73.8677], // Default center (Pune, India)
      zoom: 16,
      zoomControl: true,
    });

    // Add OpenStreetMap tiles with offline caching support
    const tileLayer = L.tileLayer(
      "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }
    );

    tileLayer.addTo(map.current);

    // Cache tiles for offline use
    tileLayer.on("tileload", (e: any) => {
      const tile = e.tile;
      const url = tile.src;
      
      // Store in cache API if available
      if ("caches" in window) {
        caches.open("map-tiles-v1").then((cache) => {
          cache.add(url).catch(() => {
            // Ignore cache errors
          });
        });
      }
    });

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  // Draw all routes on map
  useEffect(() => {
    if (!map.current || !allRoutes.length) return;

    allRoutes.forEach((route) => {
      if (route.geometry.type === "LineString") {
        const coords = route.geometry.coordinates.map(
          (coord) => [coord[1], coord[0]] as [number, number]
        );

        const color = categoryColors[route.properties.category] || categoryColors.general;
        const isActive = route.properties.name === routeData.properties.name;

        const polyline = L.polyline(coords, {
          color: color,
          weight: isActive ? 6 : 3,
          opacity: isActive ? 1 : 0.3,
        }).addTo(map.current!);

        if (isActive) {
          currentPolyline.current = polyline;

          // Add directional arrows using polylineDecorator
          const decorator = (L as any).polylineDecorator(polyline, {
            patterns: [
              {
                offset: 25,
                repeat: 50,
                symbol: (L as any).Symbol.arrowHead({
                  pixelSize: 12,
                  polygon: false,
                  pathOptions: {
                    stroke: true,
                    color: color,
                    weight: 2,
                  },
                }),
              },
            ],
          });
          decorator.addTo(map.current!);

          // Add start marker
          const startIcon = L.divIcon({
            className: "custom-marker",
            html: `<div style="background-color: ${color}; width: 32px; height: 32px; border-radius: 50%; border: 3px solid white; display: flex; align-items: center; justify-content: center; font-weight: bold; color: white; box-shadow: 0 2px 8px rgba(0,0,0,0.3);">S</div>`,
            iconSize: [32, 32],
            iconAnchor: [16, 16],
          });

          L.marker(coords[0], { icon: startIcon })
            .addTo(map.current!)
            .bindPopup(`<b>Start:</b> ${route.properties.name.split(" to ")[0]}`);

          // Add end marker
          const endIcon = L.divIcon({
            className: "custom-marker",
            html: `<div style="background-color: ${color}; width: 32px; height: 32px; border-radius: 50%; border: 3px solid white; display: flex; align-items: center; justify-content: center; font-weight: bold; color: white; box-shadow: 0 2px 8px rgba(0,0,0,0.3);">E</div>`,
            iconSize: [32, 32],
            iconAnchor: [16, 16],
          });

          L.marker(coords[coords.length - 1], { icon: endIcon })
            .addTo(map.current!)
            .bindPopup(`<b>End:</b> ${route.properties.name.split(" to ")[1]}`);

          // Fit map to route bounds
          map.current!.fitBounds(polyline.getBounds(), { padding: [50, 50] });
        }
      }
    });
  }, [allRoutes, routeData]);

  // Animate marker along route
  useEffect(() => {
    if (!map.current || !currentPolyline.current || !isPlaying) {
      if (animationFrame.current) {
        cancelAnimationFrame(animationFrame.current);
        animationFrame.current = null;
      }
      return;
    }

    const coords = currentPolyline.current.getLatLngs() as L.LatLng[];
    const totalPoints = coords.length;

    // Create or update moving marker
    if (!movingMarker.current) {
      const markerIcon = L.divIcon({
        className: "custom-marker",
        html: `<div style="background-color: #ef4444; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3); animation: pulse 2s infinite;"></div>`,
        iconSize: [20, 20],
        iconAnchor: [10, 10],
      });

      movingMarker.current = L.marker(coords[0], { icon: markerIcon }).addTo(
        map.current!
      );
    }

    let currentIndex = Math.floor(progress * totalPoints);

    const animate = () => {
      if (!isPlaying || !movingMarker.current) return;

      currentIndex = (currentIndex + 1) % totalPoints;
      const newProgress = currentIndex / totalPoints;
      setProgress(newProgress);

      // Update step based on progress
      const step = Math.floor(newProgress * 3); // Assuming 3 steps
      onStepChange(step);

      movingMarker.current.setLatLng(coords[currentIndex]);

      // Center map on marker
      map.current!.panTo(coords[currentIndex]);

      animationFrame.current = requestAnimationFrame(animate);
    };

    animationFrame.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrame.current) {
        cancelAnimationFrame(animationFrame.current);
        animationFrame.current = null;
      }
    };
  }, [isPlaying, progress, onStepChange]);

  // Jump to step when clicked
  useEffect(() => {
    if (!currentPolyline.current || !map.current) return;

    const coords = currentPolyline.current.getLatLngs() as L.LatLng[];
    const stepIndex = Math.floor((activeStep / 3) * coords.length);
    const targetCoord = coords[stepIndex] || coords[0];

    map.current.setView(targetCoord, 18, { animate: true });

    if (movingMarker.current) {
      movingMarker.current.setLatLng(targetCoord);
    }
  }, [activeStep]);

  return (
    <>
      <style>
        {`
          @keyframes pulse {
            0%, 100% {
              opacity: 1;
              transform: scale(1);
            }
            50% {
              opacity: 0.7;
              transform: scale(1.1);
            }
          }
        `}
      </style>
      <div ref={mapContainer} className="w-full h-full" />
    </>
  );
};

export default NavigationMap;
