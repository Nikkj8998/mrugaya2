import React, { useState } from 'react';
import { Heart } from 'lucide-react';
import { useFavorites } from '../context/FavoritesContext';
import { FavoriteItem } from '../types/favorites';

interface FavoriteButtonProps {
  item: Omit<FavoriteItem, 'dateAdded'>;
  className?: string;
  showText?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const FavoriteButton: React.FC<FavoriteButtonProps> = ({ 
  item, 
  className = '', 
  showText = false,
  size = 'md'
}) => {
  const { addFavorite, removeFavorite, isFavorite } = useFavorites();
  const [isAnimating, setIsAnimating] = useState(false);
  
  const isLiked = isFavorite(item.id);

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setIsAnimating(true);
    
    if (isLiked) {
      removeFavorite(item.id);
    } else {
      addFavorite(item);
    }
    
    // Reset animation after a short delay
    setTimeout(() => setIsAnimating(false), 300);
  };

  return (
    <button
      onClick={handleToggleFavorite}
      className={`
        group relative flex items-center justify-center space-x-2 
        transition-all duration-300 transform hover:scale-110
        ${isLiked 
          ? 'text-red-500 hover:text-red-600' 
          : 'text-gray-400 hover:text-red-500'
        }
        ${className}
      `}
      aria-label={isLiked ? 'Remove from favorites' : 'Add to favorites'}
    >
      {/* Heart Icon */}
      <div className="relative">
        <Heart 
          className={`
            ${sizeClasses[size]} transition-all duration-300
            ${isLiked ? 'fill-current' : 'fill-none'}
            ${isAnimating ? 'animate-pulse scale-125' : ''}
          `}
        />
        
        {/* Animated heart particles effect */}
        {isAnimating && !isLiked && (
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-red-500 rounded-full animate-ping"
                style={{
                  top: '50%',
                  left: '50%',
                  animationDelay: `${i * 50}ms`,
                  transform: `translate(-50%, -50%) rotate(${i * 60}deg) translateY(-10px)`,
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Optional text */}
      {showText && (
        <span className="text-sm font-medium">
          {isLiked ? 'Liked' : 'Like'}
        </span>
      )}

      {/* Tooltip */}
      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
        {isLiked ? 'Remove from favorites' : 'Add to favorites'}
      </div>
    </button>
  );
};

export default FavoriteButton;