export type Vehicle = {
  id: string;
  slug: string;
  brand: string;
  model: string;
  category: "Economique" | "Confort" | "SUV" | "Premium";
  pricePerDay: number;
  transmission: "Automatique" | "Manuelle";
  fuel: "Essence" | "Diesel";
  seats: number;
  image: string;
};

export const vehicles: Vehicle[] = [
  {
    id: "1",
    slug: "dacia-logan",
    brand: "Dacia",
    model: "Logan",
    category: "Economique",
    pricePerDay: 250,
    transmission: "Manuelle",
    fuel: "Diesel",
    seats: 5,
    image: "https://placehold.co/800x600/141414/FFFFFF?text=Dacia+Logan",
  },
  {
    id: "2",
    slug: "renault-clio-5",
    brand: "Renault",
    model: "Clio 5",
    category: "Economique",
    pricePerDay: 300,
    transmission: "Manuelle",
    fuel: "Essence",
    seats: 5,
    image: "https://placehold.co/800x600/141414/FFFFFF?text=Renault+Clio+5",
  },
  {
    id: "3",
    slug: "peugeot-208",
    brand: "Peugeot",
    model: "208",
    category: "Confort",
    pricePerDay: 350,
    transmission: "Automatique",
    fuel: "Diesel",
    seats: 5,
    image: "https://placehold.co/800x600/141414/FFFFFF?text=Peugeot+208",
  },
  {
    id: "4",
    slug: "dacia-duster",
    brand: "Dacia",
    model: "Duster",
    category: "Confort",
    pricePerDay: 400,
    transmission: "Automatique",
    fuel: "Diesel",
    seats: 5,
    image: "https://placehold.co/800x600/141414/FFFFFF?text=Dacia+Duster",
  },
  {
    id: "5",
    slug: "hyundai-tucson",
    brand: "Hyundai",
    model: "Tucson",
    category: "SUV",
    pricePerDay: 600,
    transmission: "Automatique",
    fuel: "Diesel",
    seats: 5,
    image: "https://placehold.co/800x600/141414/FFFFFF?text=Hyundai+Tucson",
  },
  {
    id: "6",
    slug: "range-rover-evoque",
    brand: "Range Rover",
    model: "Evoque",
    category: "Premium",
    pricePerDay: 1200,
    transmission: "Automatique",
    fuel: "Essence",
    seats: 5,
    image: "https://placehold.co/800x600/141414/FFFFFF?text=Range+Rover+Evoque",
  },
];