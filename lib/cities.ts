// Major world cities for autocomplete
export const MAJOR_CITIES = [
  "New York", "Los Angeles", "Chicago", "Houston", "Phoenix", "Philadelphia", "San Antonio", "San Diego", "Dallas", "San Jose",
  "Austin", "Jacksonville", "Fort Worth", "Columbus", "Charlotte", "San Francisco", "Indianapolis", "Seattle", "Denver", "Washington",
  "Boston", "El Paso", "Nashville", "Detroit", "Oklahoma City", "Portland", "Las Vegas", "Memphis", "Louisville", "Baltimore",
  "Milwaukee", "Albuquerque", "Tucson", "Fresno", "Sacramento", "Kansas City", "Long Beach", "Mesa", "Atlanta", "Colorado Springs",
  "Virginia Beach", "Raleigh", "Omaha", "Miami", "Oakland", "Minneapolis", "Tulsa", "Cleveland", "Wichita", "Arlington",
  
  // International major cities
  "London", "Paris", "Berlin", "Madrid", "Rome", "Amsterdam", "Barcelona", "Vienna", "Prague", "Budapest",
  "Warsaw", "Stockholm", "Oslo", "Copenhagen", "Helsinki", "Dublin", "Brussels", "Zurich", "Geneva", "Milan",
  "Tokyo", "Seoul", "Beijing", "Shanghai", "Hong Kong", "Singapore", "Bangkok", "Mumbai", "Delhi", "Bangalore",
  "Sydney", "Melbourne", "Perth", "Brisbane", "Auckland", "Wellington",
  "Toronto", "Vancouver", "Montreal", "Calgary", "Ottawa", "Edmonton", "Winnipeg", "Quebec City",
  "Mexico City", "Guadalajara", "Monterrey", "Puebla", "Tijuana", "León", "Juárez", "Zapopan",
  "São Paulo", "Rio de Janeiro", "Salvador", "Brasília", "Fortaleza", "Belo Horizonte", "Manaus", "Curitiba",
  "Buenos Aires", "Córdoba", "Rosario", "Mendoza", "La Plata", "San Miguel de Tucumán",
  "Lima", "Arequipa", "Trujillo", "Chiclayo", "Piura", "Iquitos", "Cusco", "Chimbote",
  "Santiago", "Valparaíso", "Concepción", "La Serena", "Antofagasta", "Temuco",
  "Bogotá", "Medellín", "Cali", "Barranquilla", "Cartagena", "Cúcuta", "Bucaramanga", "Pereira",
  "Cairo", "Alexandria", "Giza", "Shubra El Kheima", "Port Said", "Suez",
  "Lagos", "Kano", "Ibadan", "Kaduna", "Port Harcourt", "Benin City",
  "Johannesburg", "Cape Town", "Durban", "Pretoria", "Port Elizabeth", "Bloemfontein",
  "Casablanca", "Rabat", "Fez", "Marrakech", "Agadir", "Tangier",
  "Nairobi", "Mombasa", "Nakuru", "Eldoret", "Kisumu", "Thika"
];

export function searchCities(query: string, limit = 10): string[] {
  if (!query.trim()) return [];
  const q = query.toLowerCase();
  return MAJOR_CITIES
    .filter(city => city.toLowerCase().includes(q))
    .sort((a, b) => {
      const aStarts = a.toLowerCase().startsWith(q);
      const bStarts = b.toLowerCase().startsWith(q);
      if (aStarts && !bStarts) return -1;
      if (!aStarts && bStarts) return 1;
      return a.localeCompare(b);
    })
    .slice(0, limit);
}

