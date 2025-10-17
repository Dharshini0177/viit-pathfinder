-- Create locations table for campus buildings and landmarks
CREATE TABLE public.locations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  type TEXT NOT NULL, -- 'building', 'landmark', 'facility'
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create routes table
CREATE TABLE public.routes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  route_name TEXT NOT NULL,
  description TEXT NOT NULL,
  start_location_id UUID REFERENCES public.locations(id),
  end_location_id UUID REFERENCES public.locations(id),
  distance DECIMAL(5, 2) NOT NULL, -- in kilometers
  estimated_time INTEGER NOT NULL, -- in minutes
  difficulty TEXT CHECK (difficulty IN ('Easy', 'Medium', 'Hard')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create waypoints table for intermediate points along routes
CREATE TABLE public.waypoints (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  route_id UUID REFERENCES public.routes(id) ON DELETE CASCADE,
  location_id UUID REFERENCES public.locations(id),
  sequence_order INTEGER NOT NULL,
  instruction TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create route_coordinates table for the path geometry
CREATE TABLE public.route_coordinates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  route_id UUID REFERENCES public.routes(id) ON DELETE CASCADE,
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  sequence_order INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.routes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.waypoints ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.route_coordinates ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access (campus navigation is public)
CREATE POLICY "Allow public read access to locations"
  ON public.locations FOR SELECT
  USING (true);

CREATE POLICY "Allow public read access to routes"
  ON public.routes FOR SELECT
  USING (true);

CREATE POLICY "Allow public read access to waypoints"
  ON public.waypoints FOR SELECT
  USING (true);

CREATE POLICY "Allow public read access to route_coordinates"
  ON public.route_coordinates FOR SELECT
  USING (true);

-- Insert sample locations for VIIT campus (Gajuwaka, Visakhapatnam)
-- Note: Using approximate coordinates for VIIT campus area
INSERT INTO public.locations (name, type, latitude, longitude, description) VALUES
('Bajrangdas Lohiya Central Library', 'building', 17.7231, 83.2185, 'Main campus library'),
('Computer Lab Block A', 'building', 17.7235, 83.2190, 'Primary computer laboratory complex'),
('Main Entrance Gate', 'facility', 17.7225, 83.2175, 'Main campus entrance'),
('Girls Hostel', 'building', 17.7240, 83.2195, 'On-campus girls hostel'),
('Campus Canteen', 'facility', 17.7233, 83.2188, 'Main dining facility'),
('Engineering Lab Block', 'building', 17.7238, 83.2193, 'Engineering laboratories'),
('Campus Auditorium', 'facility', 17.7242, 83.2185, 'Main auditorium for events'),
('Administration Building', 'building', 17.7228, 83.2180, 'Administrative offices'),
('Sports Complex', 'facility', 17.7235, 83.2198, 'Sports facilities'),
('Academic Block', 'building', 17.7232, 83.2187, 'Main academic building'),
('Student Plaza', 'landmark', 17.7234, 83.2189, 'Central student gathering area'),
('Boys Hostel', 'building', 17.7100, 83.2050, 'Off-campus boys hostel (2-3km away)');

-- Create indexes for better query performance
CREATE INDEX idx_routes_start_location ON public.routes(start_location_id);
CREATE INDEX idx_routes_end_location ON public.routes(end_location_id);
CREATE INDEX idx_waypoints_route ON public.waypoints(route_id);
CREATE INDEX idx_route_coordinates_route ON public.route_coordinates(route_id);
CREATE INDEX idx_route_coordinates_sequence ON public.route_coordinates(route_id, sequence_order);