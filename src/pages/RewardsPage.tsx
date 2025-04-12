
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { NavBar } from '@/components/layout/NavBar';
import { Gift, Package, Handshake, Search, Filter } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { ProductCard, Product } from '@/components/marketplace/ProductCard';
import { marketplaceProducts, getProductsByCategory } from '@/data/marketplaceProducts';
import betterIndiaLogo from '/src/assets/images/partners/better_india.jpg';
import enactusLogo from '/src/assets/images/partners/enactus_india.jpg';
import mafiaLogo from '/src/assets/images/partners/sustainability_mafia.jpg';
// Types for our rewards data
interface Coupon {
  id: string;
  brand: string;
  description: string;
  code: string;
  pointCost: number;
  logo: string;
  isRevealed?: boolean;
}

interface Collaboration {
  id: string;
  partner: string;
  offer: string;
  description: string;
  logo: string;
  pointCost: number;
}

const RewardsPage: React.FC = () => {
  const { user } = useAuth();
  const [userPoints, setUserPoints] = useState<number>(350); // This would come from user data
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  
  const [coupons, setCoupons] = useState<Coupon[]>([
    {
      id: "c1",
      brand: "Swiggy",
      description: "₹100 off on orders above ₹400",
      code: "SWIGGY100",
      pointCost: 100,
      logo: "/src/assets/images/Cupons/swiggy.svg",
      isRevealed: false,
    },
    {
      id: "c2",
      brand: "Zomato",
      description: "₹75 off on orders above ₹300",
      code: "ZOMATO75",
      pointCost: 75,
      logo: "/src/assets/images/Cupons/zomato.svg",
      isRevealed: false,
    },
    {
      id: "c3",
      brand: "Paytm",
      description: "₹50 cashback on recharges",
      code: "PAYTM50",
      pointCost: 50,
      logo: "/src/assets/images/Cupons/paytm.png",
      isRevealed: false,
    },
    {
      id: "c4",
      brand: "BigBasket",
      description: "₹150 off on grocery above ₹1000",
      code: "BBSAVE150",
      pointCost: 150,
      logo: "/src/assets/images/Cupons/bigbasket.svg",
      isRevealed: false,
    }
  ]);
  
  const [collaborations, setCollaborations] = useState<Collaboration[]>([
  {
    id: "col1",
    partner: "Better India Mission",
    offer: "Free Tree Sapling",
    description: "Redeem points for a free tree sapling at any participating nursery",
    logo: betterIndiaLogo,
    pointCost: 200,
  },
  {
    id: "col2",
    partner: "Enactus India",
    offer: "15% Discount",
    description: "Get 15% off on any purchase at Enactus India stores",
    logo: enactusLogo,
    pointCost: 150,
  },
  {
    id: "col3",
    partner: "Sustainability Mafia",
    offer: "T-Shirt Discount",
    description: "₹1000 off on sustainability T-shirts (min 5)",
    logo: mafiaLogo,
    pointCost: 300,
  }
]);
  // Filter products when category or search changes
  useEffect(() => {
    let filtered = marketplaceProducts;
    
    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(query) || 
        product.description.toLowerCase().includes(query) ||
        product.brand.toLowerCase().includes(query)
      );
    }
    
    setFilteredProducts(filtered);
  }, [selectedCategory, searchQuery]);

  const revealCoupon = (id: string) => {
    const coupon = coupons.find(c => c.id === id);
    if (!coupon) return;
    
    if (userPoints < coupon.pointCost) {
      toast.error("Not enough points!", {
        description: `You need ${coupon.pointCost - userPoints} more points to unlock this coupon.`
      });
      return;
    }
    
    // Update user points and reveal coupon
    setUserPoints(prev => prev - coupon.pointCost);
    setCoupons(prev => prev.map(c => 
      c.id === id ? {...c, isRevealed: true} : c
    ));
    
    toast.success("Coupon Unlocked!", {
      description: `${coupon.pointCost} points have been deducted from your account.`
    });
  };
  
  const purchaseProduct = (product: Product) => {
    if (userPoints < product.pointCost) {
      toast.error("Not enough points!", {
        description: `You need ${product.pointCost - userPoints} more points to buy this product.`
      });
      return;
    }
    
    setUserPoints(prev => prev - product.pointCost);
    toast.success("Product Purchased!", {
      description: `${product.name} will be delivered to your address soon.`
    });
  };
  
  const redeemCollaboration = (collab: Collaboration) => {
    if (userPoints < collab.pointCost) {
      toast.error("Not enough points!", {
        description: `You need ${collab.pointCost - userPoints} more points to redeem this offer.`
      });
      return;
    }
    
    setUserPoints(prev => prev - collab.pointCost);
    toast.success("Offer Redeemed!", {
      description: `${collab.offer} from ${collab.partner} has been added to your account.`
    });
  };

  const categories = [
    { id: "all", name: "All Products" },
    { id: "gardening", name: "Gardening" },
    { id: "home", name: "Home & Lifestyle" },
    { id: "essentials", name: "Essentials" },
    { id: "apparel", name: "Apparel" },
    { id: "gifts", name: "Gifts & DIY" }
  ];

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      <div className="bg-primary text-white pt-12 pb-6 px-4 rounded-b-3xl shadow-md">
        <h1 className="text-2xl font-bold">Rewards</h1>
        <p className="mt-2 text-white/80">You have <span className="font-bold">{userPoints}</span> points</p>
      </div>
      
      <div className="px-4 mt-6">
        <Tabs defaultValue="products" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="products" className="flex flex-col items-center py-2">
              <Package className="h-5 w-5 mb-1" />
              <span className="text-xs">Products</span>
            </TabsTrigger>
            <TabsTrigger value="coupons" className="flex flex-col items-center py-2">
              <Gift className="h-5 w-5 mb-1" />
              <span className="text-xs">Coupons</span>
            </TabsTrigger>
            <TabsTrigger value="collaborations" className="flex flex-col items-center py-2">
              <Handshake className="h-5 w-5 mb-1" />
              <span className="text-xs">Partners</span>
            </TabsTrigger>
          </TabsList>
          
          {/* Products Tab */}
          <TabsContent value="products" className="mt-4">
            <div className="mb-4">
              <div className="relative mb-4">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search products..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <div className="flex overflow-x-auto pb-2 gap-2 no-scrollbar">
                {categories.map(category => (
                  <Button
                    key={category.id}
                    variant={selectedCategory === category.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category.id)}
                    className="whitespace-nowrap"
                  >
                    {category.name}
                  </Button>
                ))}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onPurchase={purchaseProduct}
                />
              ))}
            </div>
            
            {filteredProducts.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500">No products found matching your criteria</p>
              </div>
            )}
          </TabsContent>
          
          {/* Coupons Tab */}
          <TabsContent value="coupons" className="mt-4">
            <div className="grid grid-cols-1 gap-4">
              {coupons.map((coupon) => (
                <div key={coupon.id} className="bg-white rounded-xl p-4 shadow-sm">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 flex-shrink-0 bg-white rounded-md p-1 flex items-center justify-center">
                      <img 
                        src={coupon.logo} 
                        alt={coupon.brand} 
                        className="max-w-full max-h-full object-contain"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold">{coupon.brand}</h3>
                      <p className="text-sm text-gray-500">{coupon.description}</p>
                    </div>
                    <div className="text-right text-sm">
                      <div className="font-medium text-secondary">{coupon.pointCost} pts</div>
                    </div>
                  </div>
                  
                  {coupon.isRevealed ? (
                    <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                      <p className="text-center font-mono font-bold text-primary">{coupon.code}</p>
                      <p className="text-center text-xs mt-1 text-gray-500">Copy and use at checkout</p>
                    </div>
                  ) : (
                    <div className="mt-4 text-center">
                      <Button 
                        onClick={() => revealCoupon(coupon.id)}
                        className="w-full"
                      >
                        Unlock Coupon
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </TabsContent>
          
          {/* Collaborations Tab */}
          <TabsContent value="collaborations" className="mt-4">
            <div className="grid grid-cols-1 gap-4">
              {collaborations.map((collab) => (
                <div key={collab.id} className="bg-white rounded-xl p-4 shadow-sm">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 flex-shrink-0 bg-white rounded-md p-1 flex items-center justify-center">
                      <img 
                        src={collab.logo} 
                        alt={collab.partner} 
                        className="max-w-full max-h-full object-contain"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold">{collab.partner}</h3>
                      <p className="text-sm font-medium text-secondary">{collab.offer}</p>
                      <p className="text-xs text-gray-500">{collab.description}</p>
                    </div>
                  </div>
                  
                  <div className="mt-4 flex items-center justify-between">
                    <div className="text-secondary font-medium">{collab.pointCost} pts</div>
                    <Button 
                      onClick={() => redeemCollaboration(collab)}
                      variant="outline"
                    >
                      Redeem Offer
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      <NavBar />
    </div>
  );
};

export default RewardsPage;
