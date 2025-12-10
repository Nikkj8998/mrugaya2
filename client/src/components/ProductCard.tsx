import React, { useState } from 'react';
import { Star, Heart, ShoppingCart, Zap } from 'lucide-react';
import { useAuthContext } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useLocation } from 'wouter';
import FavoriteButton from './FavoriteButton';

interface ProductCardProps {
  product: {
    id: number;
    name: string;
    price: string;
    originalPrice: string;
    image: string;
    rating: number;
    reviews: number;
    category: string;
    description?: string;
  };
  onQuickView?: (product: any) => void;
  className?: string;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onQuickView, className = '' }) => {
  const { isAuthenticated } = useAuthContext();
  const { addItem, toggleCart } = useCart();
  const [, setLocation] = useLocation();
  const [isHovered, setIsHovered] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);
  const [buyingNow, setBuyingNow] = useState(false);

  const formatPrice = (price: string) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(parseInt(price.replace(/[^\d]/g, '')));
  };

  // Use Most Loved Creations gradient theme for all cards
  const themeColors = {
    buyNow: 'bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-700 hover:to-amber-700',
    addToCart: 'border-red-600 text-red-600 hover:bg-red-600',
    hoverEffect: 'hover:shadow-red-500/30 hover:shadow-xl'
  };

  const handleAuthRequired = (action: 'buy' | 'cart') => {
    if (!isAuthenticated) {
      // Store the intended action and redirect to login
      sessionStorage.setItem('authRedirectPath', '/');
      sessionStorage.setItem('pendingAction', action);
      sessionStorage.setItem('pendingProduct', JSON.stringify(product));
      setLocation('/login');
      return false;
    }
    return true;
  };

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!handleAuthRequired('cart')) return;
    
    setAddingToCart(true);
    
    try {
      // Add item to cart
      addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        originalPrice: product.originalPrice,
        image: product.image,
        category: product.category,
        rating: product.rating,
        reviews: product.reviews,
      });
      
      // Show success animation
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Auto-open cart drawer
      setTimeout(() => {
        toggleCart();
      }, 600);
    } finally {
      setAddingToCart(false);
    }
  };

  const handleBuyNow = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!handleAuthRequired('buy')) return;
    
    setBuyingNow(true);
    
    try {
      // Add item to cart
      addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        originalPrice: product.originalPrice,
        image: product.image,
        category: product.category,
        rating: product.rating,
        reviews: product.reviews,
      });
      
      // Show loading animation
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Open cart for immediate checkout
      toggleCart();
    } finally {
      setBuyingNow(false);
    }
  };

  return (
    <div 
      className={`group relative bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 hover:rotate-1 overflow-hidden ${themeColors.hoverEffect} ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      data-testid={`card-product-${product.id}`}
    >
      {/* Product Image Container */}
      <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          data-testid={`img-product-${product.id}`}
        />
        
        {/* Light overlay on Hover */}
        <div className={`absolute inset-0 bg-black transition-opacity duration-300 ${isHovered ? 'opacity-10' : 'opacity-0'}`} />
        
        {/* Description Overlay - Hidden by default, shown on hover */}
        {product.description && (
          <div className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-end p-6 transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
            <p className="text-white text-sm leading-relaxed">
              {product.description}
            </p>
          </div>
        )}

        {/* Favorite Button */}
        <div className="absolute top-4 left-4">
          <FavoriteButton
            item={{
              id: product.id,
              name: product.name,
              price: product.price,
              originalPrice: product.originalPrice,
              image: product.image,
              category: product.category,
              rating: product.rating,
              reviews: product.reviews,
            }}
          />
        </div>

        {/* Category Badge */}
        <div className="absolute bottom-4 left-4">
          <span className="bg-red-600/90 backdrop-blur-sm text-white text-xs font-medium px-3 py-1 rounded-full">
            {product.category}
          </span>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-6">
        {/* Rating */}
        <div className="flex items-center mb-3">
          <div className="flex items-center text-amber-400 mr-2">
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i} 
                className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'fill-current' : 'text-gray-300'}`} 
              />
            ))}
          </div>
          <span className="text-sm text-gray-600" data-testid={`text-rating-${product.id}`}>
            {product.rating} ({product.reviews})
          </span>
        </div>

        {/* Product Name */}
        <h3 
          className="font-serif font-bold text-gray-900 mb-3 text-lg group-hover:text-red-800 transition-colors line-clamp-2"
          data-testid={`text-name-${product.id}`}
        >
          {product.name}
        </h3>

        {/* Price */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <span 
              className="text-2xl font-bold text-red-600"
              data-testid={`text-price-${product.id}`}
            >
              {formatPrice(product.price)}
            </span>
            {product.originalPrice !== product.price && (
              <span 
                className="text-sm text-gray-400 line-through"
                data-testid={`text-original-price-${product.id}`}
              >
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>
          
          {/* Discount Badge */}
          {product.originalPrice !== product.price && (
            <div className="bg-green-100 text-green-800 text-xs font-bold px-2 py-1 rounded-full">
              SAVE {Math.round((1 - parseInt(product.price.replace(/[^\d]/g, '')) / parseInt(product.originalPrice.replace(/[^\d]/g, ''))) * 100)}%
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3">
          {/* Buy Now Button */}
          <button
            onClick={handleBuyNow}
            disabled={buyingNow}
            className={`flex-1 ${themeColors.buyNow} text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2`}
            data-testid={`button-buy-now-${product.id}`}
          >
            {buyingNow ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Processing...</span>
              </>
            ) : (
              <>
                <Zap className="w-4 h-4" />
                <span>Buy Now</span>
              </>
            )}
          </button>

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            disabled={addingToCart}
            className={`flex-1 bg-white border-2 ${themeColors.addToCart} hover:text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2`}
            data-testid={`button-add-cart-${product.id}`}
          >
            {addingToCart ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                <span>Adding...</span>
              </>
            ) : (
              <>
                <ShoppingCart className="w-4 h-4" />
                <span>Add to Cart</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;