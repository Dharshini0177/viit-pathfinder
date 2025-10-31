import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download, Maximize2, Minimize2, Play, Pause } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import NavigationMap from "@/components/NavigationMap";
import { useToast } from "@/hooks/use-toast";

interface RouteStep {
  number: number;
  instruction: string;
  distance?: string;
}

interface RouteFeature {
  type: string;
  properties: {
    name: string;
    category: string;
    description?: string;
    steps?: RouteStep[];
  };
  geometry: {
    type: string;
    coordinates: number[][];
  };
}

const categoryColors: Record<string, string> = {
  academic: "#3b82f6",
  hostel: "#10b981",
  religious: "#f97316",
  events: "#a855f7",
  general: "#6b7280",
};

const Navigation = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [routeData, setRouteData] = useState<RouteFeature | null>(null);
  const [allRoutes, setAllRoutes] = useState<RouteFeature[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  useEffect(() => {
    const fetchRouteData = async () => {
      try {
        const cacheKey = "viit_routes_geojson";
        let data;

        // Try to load from cache first
        const cached = localStorage.getItem(cacheKey);
        if (cached) {
          data = JSON.parse(cached);
        } else {
          const response = await fetch(
            "https://gist.githubusercontent.com/Dharshini0177/26784fd66c27f17ea6710c98890048aa/raw/c253a1cdc9f029c4613aa882d041978a2b38340a/college_map.geojson"
          );
          data = await response.json();
          localStorage.setItem(cacheKey, JSON.stringify(data));
        }

        const features = data.features as RouteFeature[];
        setAllRoutes(features);

        // Find the specific route by ID (using route name or index)
        const route = features[parseInt(id || "0")] || features[0];
        setRouteData(route);
      } catch (error) {
        console.error("Error loading route data:", error);
        toast({
          title: "Error",
          description: "Failed to load route data. Using cached data if available.",
          variant: "destructive",
        });
      }
    };

    fetchRouteData();
  }, [id, toast]);

  const handleDownloadOffline = () => {
    toast({
      title: "Route Downloaded",
      description: "Route data saved for offline use. Map tiles will be cached as you view them.",
    });
  };

  const togglePlayback = () => {
    setIsPlaying(!isPlaying);
  };

  if (!routeData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading route...</p>
      </div>
    );
  }

  const steps = routeData.properties.steps || [
    { number: 1, instruction: "Start at " + (routeData.properties.name.split(" to ")[0] || "start point") },
    { number: 2, instruction: "Follow the marked path" },
    { number: 3, instruction: "Arrive at " + (routeData.properties.name.split(" to ")[1] || "destination") },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border p-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-lg font-semibold">{routeData.properties.name}</h1>
            <div className="flex items-center gap-2 mt-1">
              <Badge
                style={{
                  backgroundColor: categoryColors[routeData.properties.category] || categoryColors.general,
                  color: "white",
                }}
              >
                {routeData.properties.category}
              </Badge>
              {isOffline && (
                <Badge variant="outline" className="text-xs">
                  ⚡ Offline Mode
                </Badge>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleDownloadOffline}
          >
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsFullscreen(!isFullscreen)}
          >
            {isFullscreen ? (
              <Minimize2 className="h-5 w-5" />
            ) : (
              <Maximize2 className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col h-[calc(100vh-73px)]">
        {/* Map Section */}
        <div className={isFullscreen ? "h-full" : "h-1/2"}>
          <NavigationMap
            routeData={routeData}
            allRoutes={allRoutes}
            isPlaying={isPlaying}
            onStepChange={setActiveStep}
            activeStep={activeStep}
          />
        </div>

        {/* Steps Section */}
        {!isFullscreen && (
          <div className="h-1/2 overflow-y-auto bg-card border-t border-border">
            <div className="p-4 border-b border-border sticky top-0 bg-card z-10">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Route Steps</h2>
                <Button
                  variant={isPlaying ? "destructive" : "default"}
                  size="sm"
                  onClick={togglePlayback}
                >
                  {isPlaying ? (
                    <>
                      <Pause className="h-4 w-4 mr-2" />
                      Pause
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4 mr-2" />
                      Start
                    </>
                  )}
                </Button>
              </div>
            </div>

            <div className="p-4 space-y-3">
              {steps.map((step, index) => (
                <Card
                  key={index}
                  className={`p-4 cursor-pointer transition-all ${
                    activeStep === index
                      ? "border-primary bg-primary/5"
                      : "hover:bg-accent"
                  }`}
                  onClick={() => setActiveStep(index)}
                >
                  <div className="flex gap-3">
                    <div
                      className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                        activeStep === index
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {step.number}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{step.instruction}</p>
                      {step.distance && (
                        <p className="text-sm text-muted-foreground mt-1">
                          {step.distance}
                        </p>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navigation;
