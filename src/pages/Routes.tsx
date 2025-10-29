import { useState } from "react";
import { Link } from "react-router-dom";
import { Search, ArrowLeft, Map, LogIn } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import RouteCard from "@/components/RouteCard";
import { routes } from "@/data/routes";

const Routes = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredRoutes = routes.filter((route) =>
    route.routeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    route.startLocation.toLowerCase().includes(searchQuery.toLowerCase()) ||
    route.endLocation.toLowerCase().includes(searchQuery.toLowerCase()) ||
    route.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4 mb-4">
            <Link to="/" className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors">
              <ArrowLeft className="h-5 w-5" />
              <span className="font-semibold">Back</span>
            </Link>
            <div className="flex items-center gap-2 ml-auto">
              <Map className="h-6 w-6 text-primary" />
              <h1 className="text-2xl font-bold">Campus Routes</h1>
            </div>
            <Link to="/auth">
              <Button variant="outline" size="sm">
                <LogIn className="w-4 h-4 mr-2" />
                Sign In
              </Button>
            </Link>
          </div>
          
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search routes, locations, or landmarks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-muted/50"
            />
          </div>
        </div>
      </header>

      {/* Routes Grid */}
      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <p className="text-muted-foreground">
            Found <span className="font-semibold text-foreground">{filteredRoutes.length}</span> route{filteredRoutes.length !== 1 ? 's' : ''}
          </p>
        </div>

        {filteredRoutes.length === 0 ? (
          <div className="text-center py-12">
            <Map className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">No routes found</h3>
            <p className="text-muted-foreground">Try adjusting your search criteria</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRoutes.map((route) => (
              <RouteCard key={route.id} route={route} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Routes;
