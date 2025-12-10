import React, { useState } from 'react';
import { ShoppingCart, Check, Plus } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { CartItem } from '../types/cart';

interface AddToCartButtonProps {
  item: Omit<CartItem, 'quantity'>;
  className?: string;
  showText?: boolean;
}

const AddToCartButton: React.FC<AddToCartButtonProps> = ({ 
  item, 
  className = '', 
  showText = true 
}) => {
  const { addItem, toggleCart } = useCart();
  const [isAdded, setIsAdded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setIsLoading(true);
    
    // Add item to cart
    addItem(item);
    
    // Show success state
    setIsAdded(true);
    
    // Simulate loading time
    await new Promise(resolve => setTimeout(resolve, 500));
    setIsLoading(false);
    
    // Auto-open cart drawer after adding item
    setTimeout(() => {
      toggleCart();
    }, 600);
    
    // Reset success state
    setTimeout(() => {
      setIsAdded(false);
    }, 2000);
  };

  const baseClasses = `
    relative overflow-hidden font-bold rounded-lg transition-all duration-300 transform 
    hover:scale-105 flex items-center justify-center space-x-2 disabled:opacity-50 
    disabled:cursor-not-allowed disabled:transform-none
  `;

  const variantClasses = isAdded
    ? 'bg-green-500 hover:bg-green-600 text-white'
    : 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white';

  return (
    <button
      onClick={handleAddToCart}
      disabled={isLoading}
      className={`${baseClasses} ${variantClasses} ${className}`}
    >
      {/* Loading State */}
      {isLoading && (
        <div className="absolute inset-0 bg-red-700 flex items-center justify-center">
          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {/* Success State */}
      {isAdded && !isLoading && (
        <>
          <Check className="w-5 h-5" />
          {showText && <span>Added!</span>}
        </>
      )}

      {/* Default State */}
      {!isAdded && !isLoading && (
        <>
          <ShoppingCart className="w-5 h-5" />
          {showText && <span>Add to Cart</span>}
        </>
      )}

      {/* Ripple Effect */}
      <div className="absolute inset-0 bg-white opacity-0 hover:opacity-10 transition-opacity duration-300 rounded-lg" />
    </button>
  );
};

export default AddToCartButton;