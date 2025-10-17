import { Link } from "react-router-dom";
import { MapPin, Clock, Navigation, TrendingUp } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Route } from "@/data/routes";

interface RouteCardProps {
  route: Route;
}

const RouteCard = ({ route }: RouteCardProps) => {
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
    <Link to={`/route/${route.id}`} className="block group">
      <Card className="h-full transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer border-border/50 bg-gradient-to-b from-card to-muted/20">
        <CardHeader>
          <div className="flex items-start justify-between mb-2">
            <CardTitle className="text-xl group-hover:text-primary transition-colors">
              {route.routeName}
            </CardTitle>
            <Badge className={getDifficultyColor(route.difficulty)}>
              {route.difficulty}
            </Badge>
          </div>
          <CardDescription className="line-clamp-2">{route.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4 text-primary" />
              <span className="font-medium">{route.startLocation}</span>
              <Navigation className="h-3 w-3 mx-1" />
              <span className="font-medium">{route.endLocation}</span>
            </div>
            
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1.5">
                <TrendingUp className="h-4 w-4 text-secondary" />
                <span className="font-semibold">{route.distance} km</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-accent" />
                <span className="font-semibold">{route.estimatedTime} min</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-1.5 pt-2">
              {route.landmarks.slice(0, 3).map((landmark, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {landmark}
                </Badge>
              ))}
              {route.landmarks.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{route.landmarks.length - 3} more
                </Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default RouteCard;
