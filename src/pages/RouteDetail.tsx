import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, MapPin, Clock, Navigation, TrendingUp, Share2, Flag, CheckCircle2, Database } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { routes } from "@/data/routes";
import { toast } from "@/hooks/use-toast";
import { useRouteData } from "@/hooks/useRouteData";
import RouteMap from "@/components/RouteMap";

const RouteDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const route = routes.find((r) => r.id === id);
  
  // Fetch route data from database
  const { data: dbRouteData, isLoading } = useRouteData(route?.routeName || "");

  if (!route) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Route not found</h2>
          <Button onClick={() => navigate("/routes")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Routes
          </Button>
        </div>
      </div>
    );
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: route.routeName,
        text: route.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link Copied!",
        description: "Route link has been copied to clipboard",
      });
    }
  };

  const handleStartNavigation = () => {
    toast({
      title: "Navigation Started",
      description: `Starting navigation for ${route.routeName}`,
    });
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "bg-secondary text-secondary-foreground";
      case "Medium":
        return "bg-accent text-accent-foreground";
      case "Hard":
        return "bg-destructive text-destructive-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4">
          <Link to="/routes" className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors mb-4">
            <ArrowLeft className="h-5 w-5" />
            <span className="font-semibold">All Routes</span>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Route Header */}
        <div className="mb-8">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold mb-2">{route.routeName}</h1>
              <p className="text-lg text-muted-foreground">{route.description}</p>
            </div>
            <Badge className={getDifficultyColor(route.difficulty)}>
              {route.difficulty}
            </Badge>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="pt-6 text-center">
                <TrendingUp className="h-8 w-8 mx-auto mb-2 text-secondary" />
                <p className="text-2xl font-bold">{route.distance} km</p>
                <p className="text-sm text-muted-foreground">Distance</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <Clock className="h-8 w-8 mx-auto mb-2 text-accent" />
                <p className="text-2xl font-bold">{route.estimatedTime} min</p>
                <p className="text-sm text-muted-foreground">Est. Time</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <Navigation className="h-8 w-8 mx-auto mb-2 text-primary" />
                <p className="text-2xl font-bold">{route.waypoints.length}</p>
                <p className="text-sm text-muted-foreground">Waypoints</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <MapPin className="h-8 w-8 mx-auto mb-2 text-primary" />
                <p className="text-2xl font-bold">{route.landmarks.length}</p>
                <p className="text-sm text-muted-foreground">Landmarks</p>
              </CardContent>
            </Card>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <Button variant="hero" size="lg" className="flex-1" onClick={handleStartNavigation}>
              <Navigation className="mr-2 h-5 w-5" />
              Start Navigation
            </Button>
            <Button variant="outline" size="lg" onClick={handleShare}>
              <Share2 className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Interactive Map */}
        {dbRouteData && dbRouteData.coordinates.length > 0 ? (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                Interactive Route Map
              </CardTitle>
              <CardDescription>Visual representation of your route with markers and path</CardDescription>
            </CardHeader>
            <CardContent>
              <RouteMap
                routeCoordinates={dbRouteData.coordinates}
                startLocation={{
                  name: dbRouteData.start_location.name,
                  latitude: Number(dbRouteData.start_location.latitude),
                  longitude: Number(dbRouteData.start_location.longitude),
                }}
                endLocation={{
                  name: dbRouteData.end_location.name,
                  latitude: Number(dbRouteData.end_location.latitude),
                  longitude: Number(dbRouteData.end_location.longitude),
                }}
                waypoints={dbRouteData.waypoints.map((w) => ({
                  name: w.location.name,
                  latitude: Number(w.location.latitude),
                  longitude: Number(w.location.longitude),
                }))}
              />
            </CardContent>
          </Card>
        ) : (
          <Card className="mb-6 border-dashed">
            <CardContent className="pt-6 text-center">
              <Database className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground mb-2">
                {isLoading ? "Loading map data..." : "Map data not available for this route yet"}
              </p>
              <p className="text-sm text-muted-foreground">
                Route coordinates will be added to the database soon
              </p>
            </CardContent>
          </Card>
        )}

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              Locations
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="mt-1 p-2 rounded-full bg-secondary/20">
                <Flag className="h-4 w-4 text-secondary" />
              </div>
              <div>
                <p className="font-semibold">Start</p>
                <p className="text-muted-foreground">{route.startLocation}</p>
              </div>
            </div>
            <Separator />
            <div className="flex items-start gap-3">
              <div className="mt-1 p-2 rounded-full bg-primary/20">
                <CheckCircle2 className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="font-semibold">Destination</p>
                <p className="text-muted-foreground">{route.endLocation}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Step-by-Step Instructions */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Navigation className="h-5 w-5 text-primary" />
              Step-by-Step Directions
            </CardTitle>
            <CardDescription>Follow these instructions to reach your destination</CardDescription>
          </CardHeader>
          <CardContent>
            <ol className="space-y-4">
              {route.instructions.map((instruction, index) => (
                <li key={index} className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
                    {index + 1}
                  </div>
                  <p className="pt-1 text-foreground">{instruction}</p>
                </li>
              ))}
            </ol>
          </CardContent>
        </Card>

        {/* Waypoints */}
        {route.waypoints.length > 0 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Waypoints</CardTitle>
              <CardDescription>Key points along your route</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {route.waypoints.map((waypoint, index) => (
                  <Badge key={index} variant="secondary" className="text-sm py-1.5">
                    {waypoint}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Landmarks */}
        {route.landmarks.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Nearby Landmarks</CardTitle>
              <CardDescription>Notable points you'll pass along the way</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {route.landmarks.map((landmark, index) => (
                  <Badge key={index} variant="outline" className="text-sm py-1.5">
                    <MapPin className="h-3 w-3 mr-1" />
                    {landmark}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
};

export default RouteDetail;
