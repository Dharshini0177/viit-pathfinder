export interface Route {
  id: string;
  routeName: string;
  description: string;
  startLocation: string;
  endLocation: string;
  distance: number;
  estimatedTime: number;
  waypoints: string[];
  instructions: string[];
  landmarks: string[];
  difficulty: "Easy" | "Medium" | "Hard";
}

export const routes: Route[] = [
  {
    id: "route001",
    routeName: "Library to Computer Lab",
    description: "Navigate from the Central Library to the main Computer Lab complex for lab sessions",
    startLocation: "Bajrangdas Lohiya Central Library",
    endLocation: "Computer Lab Block A",
    distance: 0.35,
    estimatedTime: 6,
    waypoints: ["Academic Block", "Plaza Area"],
    instructions: [
      "Exit the library building through the main entrance",
      "Head straight towards the plaza area",
      "Turn right at the intersection near the academic block",
      "Continue for 150 meters",
      "Computer Lab Block A is on your left"
    ],
    landmarks: ["Central Fountain", "Academic Block", "Student Plaza"],
    difficulty: "Easy"
  },
  {
    id: "route002",
    routeName: "Main Gate to Girls Hostel",
    description: "Route from the main entrance gate to the Girls Hostel building",
    startLocation: "Main Entrance Gate",
    endLocation: "Girls Hostel",
    distance: 0.52,
    estimatedTime: 9,
    waypoints: ["Administration Building", "Sports Complex"],
    instructions: [
      "Enter through the main gate",
      "Head towards the administration building",
      "Pass by the sports complex on your right",
      "Continue towards the residential area",
      "Girls Hostel is the first residential building on your left"
    ],
    landmarks: ["Administration Building", "Sports Complex", "Main Parking Area"],
    difficulty: "Easy"
  },
  {
    id: "route003",
    routeName: "Canteen to Engineering Lab",
    description: "Route from the campus canteen to the Engineering Laboratory Block",
    startLocation: "Campus Canteen",
    endLocation: "Engineering Lab Block",
    distance: 0.68,
    estimatedTime: 11,
    waypoints: ["Student Center", "Mechanical Lab", "Electrical Lab"],
    instructions: [
      "Exit the canteen and turn right",
      "Walk towards the student center plaza",
      "Head past the mechanical engineering lab building",
      "Continue straight towards the engineering complex",
      "Turn left at the signboard for Engineering Labs",
      "Engineering Lab Block is the main building ahead"
    ],
    landmarks: ["Student Center", "Mechanical Lab", "Electrical Workshop"],
    difficulty: "Medium"
  },
  {
    id: "route004",
    routeName: "Entrance Gate to Auditorium",
    description: "Navigate from the main entrance to the campus auditorium for events and seminars",
    startLocation: "Main Entrance Gate",
    endLocation: "Campus Auditorium",
    distance: 0.81,
    estimatedTime: 14,
    waypoints: ["Information Desk", "Central Plaza", "Green Lawn"],
    instructions: [
      "Enter through the main gate",
      "Stop at the information desk for directions if needed",
      "Walk through the central plaza area",
      "Continue towards the green lawn section",
      "The auditorium building is visible with 'Auditorium' signage",
      "Enter through the main entrance"
    ],
    landmarks: ["Information Desk", "Central Plaza", "Green Lawn", "Admin Block"],
    difficulty: "Easy"
  },
  {
    id: "route005",
    routeName: "Boys Hostel to Main Campus",
    description: "Route from the Boys Hostel (located 2-3km away) to the main campus via shuttle stop",
    startLocation: "Boys Hostel",
    endLocation: "Bus Stand / Shuttle Stop",
    distance: 2.5,
    estimatedTime: 45,
    waypoints: ["Hostel Exit", "Main Road", "Bus Stand"],
    instructions: [
      "Exit the boys hostel premises",
      "Head towards the main road",
      "Walk along the road towards the bus stop",
      "The campus shuttle stops here regularly",
      "Board the shuttle to reach the main campus"
    ],
    landmarks: ["Boys Hostel Gate", "Main Road", "VSEZ Area", "Bus Stand"],
    difficulty: "Hard"
  }
];
