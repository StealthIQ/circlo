
import React from 'react';
import { Button } from '@/components/ui/button';

export interface Product {
  id: string;
  name: string;
  description: string;
  image: string;
  price?: number;
  pointCost: number;
  category: string;
  brand: string;
}

interface ProductCardProps {
  product: Product;
  onPurchase: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onPurchase }) => {
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-sm">
      <div className="relative h-48 overflow-hidden">
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-full object-cover"
          onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
            e.currentTarget.src = '/placeholder.svg'; // Fallback image
          }}
        />
        <div className="absolute top-2 right-2 bg-secondary text-white text-xs px-2 py-1 rounded-full">
          {product.pointCost} pts
        </div>
      </div>
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-bold text-gray-900 truncate">{product.name}</h3>
        </div>
        <p className="text-xs text-gray-500 mb-1">{product.brand}</p>
        <p className="text-sm text-gray-700 line-clamp-2 mb-4 h-10">{product.description}</p>
        <Button 
          onClick={() => onPurchase(product)}
          className="w-full"
          variant="outline"
        >
          Add to cart
        </Button>
      </div>
    </div>
  );
};
