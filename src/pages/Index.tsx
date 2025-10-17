import { Link } from "react-router-dom";
import { MapPin, Navigation, TrendingUp, ArrowRight, Building2, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import campusHero from "@/assets/campus-hero.jpg";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${campusHero})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-primary/80 via-primary/60 to-background" />
        </div>
        
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <div className="mb-6 inline-flex items-center gap-2 bg-secondary/20 backdrop-blur-sm px-4 py-2 rounded-full border border-secondary/30">
            <MapPin className="h-4 w-4 text-secondary" />
            <span className="text-sm font-medium text-primary-foreground">Vignan's Institute of Information Technology</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-primary-foreground mb-6">
            Navigate Campus
            <br />
            <span className="text-secondary">With Confidence</span>
          </h1>
          
          <p className="text-xl text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
            Discover the easiest routes across our 17-acre campus. Find your way to classes, labs, hostels, and more with detailed step-by-step directions.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="hero" size="lg" asChild className="text-lg px-8">
              <Link to="/routes">
                Explore Routes
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Why Use Campus Navigator?</h2>
            <p className="text-xl text-muted-foreground">Everything you need to navigate VIIT campus efficiently</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="border-border/50 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Navigation className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Step-by-Step Directions</CardTitle>
                <CardDescription>
                  Get detailed walking directions with landmarks and waypoints to guide you every step of the way
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-border/50 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center mb-4">
                  <TrendingUp className="h-6 w-6 text-secondary" />
                </div>
                <CardTitle>Distance & Time Estimates</CardTitle>
                <CardDescription>
                  Know exactly how far you need to walk and how long it will take to reach your destination
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-border/50 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mb-4">
                  <MapPin className="h-6 w-6 text-accent" />
                </div>
                <CardTitle>Campus Landmarks</CardTitle>
                <CardDescription>
                  Discover important landmarks and points of interest along your route for easier navigation
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <Building2 className="h-10 w-10 mx-auto mb-3 text-primary" />
              <p className="text-4xl font-bold mb-2">17</p>
              <p className="text-muted-foreground">Acres Campus</p>
            </div>
            <div>
              <MapPin className="h-10 w-10 mx-auto mb-3 text-secondary" />
              <p className="text-4xl font-bold mb-2">5+</p>
              <p className="text-muted-foreground">Popular Routes</p>
            </div>
            <div>
              <Navigation className="h-10 w-10 mx-auto mb-3 text-accent" />
              <p className="text-4xl font-bold mb-2">20+</p>
              <p className="text-muted-foreground">Key Locations</p>
            </div>
            <div>
              <Users className="h-10 w-10 mx-auto mb-3 text-primary" />
              <p className="text-4xl font-bold mb-2">100%</p>
              <p className="text-muted-foreground">Coverage</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Start Navigating?</h2>
          <p className="text-xl text-muted-foreground mb-8">
            Browse all available routes and find the best path to your destination
          </p>
          <Button variant="hero" size="lg" asChild className="text-lg px-8">
            <Link to="/routes">
              View All Routes
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 px-4">
        <div className="container mx-auto max-w-6xl text-center text-muted-foreground">
          <p>© 2025 Vignan's Institute of Information Technology, Visakhapatnam</p>
          <p className="text-sm mt-2">Gajuwaka, Duvvada Area • 17 Acres Campus</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
