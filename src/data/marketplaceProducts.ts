
import type { Product } from '@/components/marketplace/ProductCard';

// These would be loaded from your database in a real app
export const marketplaceProducts: Product[] = [
  // Gardening & Composting
  {
    id: "g1",
    name: "Home Compost Bin",
    description: "Convert kitchen waste into rich compost with this easy-to-use bin",
    image: "/src/assets/images/marketplace/daily_dump_compost.jpg",
    pointCost: 1200,
    category: "gardening",
    brand: "Daily Dump"
  },
  {
    id: "g2",
    name: "Plant Starter Kit",
    description: "Complete kit with pots, soil, and seeds to start your home garden",
    image: "/src/assets/images/marketplace/Plant_Starter_Kit.jpg",
    pointCost: 800,
    category: "gardening",
    brand: "Nurserylive"
  },
  {
    id: "g3",
    name: "Gardening Tool Set",
    description: "Essential tools for maintaining your garden in premium quality",
    image: "/src/assets/images/marketplace/Gardening_Tool_Set.jpg",
    pointCost: 1000,
    category: "gardening",
    brand: "Ugaoo"
  },
  {
    id: "g4",
    name: "Organic Soil Mix",
    description: "Nutrient-rich soil for healthy plant growth and better yields",
    image: "/src/assets/images/marketplace/Organic_Soil_Mix.jpg",
    pointCost: 500,
    category: "gardening",
    brand: "TrustBasket"
  },
  
  // Home & Lifestyle
  {
    id: "h1",
    name: "Eco-Friendly Cleaner Set",
    description: "Complete home cleaning set with non-toxic, biodegradable ingredients",
    image: "/src/assets/images/marketplace/Eco_Cleaning_Bundle.jpg",
    pointCost: 850,
    category: "home",
    brand: "The Better Home"
  },
  {
    id: "h2",
    name: "Bamboo Kitchen Set",
    description: "Sustainable bamboo utensils and kitchen accessories",
    image: "/src/assets/images/marketplace/Bamboo_Kitchen_Set.jpg",
    pointCost: 750,
    category: "home",
    brand: "Beco"
  },
  {
    id: "h3",
    name: "Sustainable Decor Items",
    description: "Beautiful decor pieces made from eco-friendly materials",
    image: "/src/assets/images/marketplace/Sustainable_Decor_Items.jpg",
    pointCost: 1500,
    category: "home",
    brand: "Nicobar"
  },
  {
    id: "h4",
    name: "Upcycled Storage Boxes",
    description: "Storage solutions created from upcycled plastic waste",
    image: "/src/assets/images/marketplace/Upcycled_Storage_Boxes.jpg",
    pointCost: 900,
    category: "home",
    brand: "ReCharkha"
  },
  
  // Daily Essentials
  {
    id: "e1",
    name: "Zero Waste Starter Kit",
    description: "Everything you need to start your zero waste lifestyle journey",
    image: "/src/assets/images/marketplace/Zero_Waste_Starter_Kit.jpg",
    pointCost: 1200,
    category: "essentials",
    brand: "Bare Necessities"
  },
  {
    id: "e2",
    name: "Eco Cleaning Bundle",
    description: "Plastic-free cleaning essentials with refillable options",
    image: "/src/assets/images/marketplace/Eco_Cleaning_Bundle.jpg",
    pointCost: 950,
    category: "essentials",
    brand: "GreenFootPrint"
  },
  {
    id: "e3",
    name: "Reusable Shopping Bags",
    description: "Set of stylish and durable bags for all your shopping needs",
    image: "/src/assets/images/marketplace/Reusable_Shopping_Bags.jpg",
    pointCost: 500,
    category: "essentials",
    brand: "EcoRight"
  },
  
  // Sustainable Apparel
  {
    id: "a1",
    name: "Organic Cotton T-Shirt",
    description: "Fair-trade, organic cotton t-shirt with eco-friendly dyes",
    image: "/src/assets/images/marketplace/Organic_Cotton_Shirt.jpg",
    pointCost: 800,
    category: "apparel",
    brand: "No Nasties"
  },
  {
    id: "a2",
    name: "Sustainable Fashion Bundle",
    description: "Curated set of ethical fashion accessories and garments",
    image: "/src/assets/images/marketplace/Sustainable_Fashion_Bundle.jpg",
    pointCost: 1800,
    category: "apparel",
    brand: "Brown Living"
  },
  {
    id: "a3",
    name: "Artisan-Made Scarf",
    description: "Handcrafted scarf made from natural fabrics by skilled artisans",
    image: "/src/assets/images/marketplace/Artisan-Made_Scarf.jpg",
    pointCost: 700,
    category: "apparel",
    brand: "Okhai"
  },
  
  // Gifts, DIY & Festivals
  {
    id: "f1",
    name: "Recycled Flower Incense",
    description: "Fragrant incense sticks made from recycled temple flowers",
    image: "/src/assets/images/marketplace/Recycled_Flower_Incense.jpg",
    pointCost: 400,
    category: "gifts",
    brand: "Phool"
  },
  {
    id: "f2",
    name: "Zero Waste Gift Box",
    description: "Perfect sustainable gift box with eco-friendly products",
    image: "/src/assets/images/marketplace/Zero_Waste_Gift_Box.jpg",
    pointCost: 1200,
    category: "gifts",
    brand: "Goli Soda"
  },
  {
    id: "f3",
    name: "Plantable Greeting Cards",
    description: "Set of greeting cards that grow into plants when planted",
    image: "/src/assets/images/marketplace/Plantable_Greeting_Cards.jpg",
    pointCost: 300,
    category: "gifts",
    brand: "Seed Paper India"
  },
  {
    id: "f4",
    name: "Kids Recycling Kit",
    description: "Educational kit to teach children about recycling and waste management",
    image: "/src/assets/images/marketplace/Kids_Recycling_Kit.jpg",
    pointCost: 600,
    category: "gifts",
    brand: "2bin1bag"
  },
  {
    id: "f5",
    name: "Biodegradable Party Set",
    description: "Complete set of biodegradable plates, cups and cutlery for events",
    image: "/src/assets/images/marketplace/Biodegradable_Party_Set.jpg",
    pointCost: 900,
    category: "gifts",
    brand: "Tamul Plates"
  }
];

export const getProductsByCategory = (category: string): Product[] => {
  return marketplaceProducts.filter(product => product.category === category);
};

export const getProductById = (id: string): Product | undefined => {
  return marketplaceProducts.find(product => product.id === id);
};
