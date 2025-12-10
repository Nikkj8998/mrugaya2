import React from 'react';
import { X, Heart, ShoppingCart, Trash2 } from 'lucide-react';
import { useFavorites } from '../context/FavoritesContext';
import { useCart } from '../context/CartContext';
import AddToCartButton from './AddToCartButton';

const FavoritesDrawer: React.FC = () => {
  const { state, closeFavorites, removeFavorite } = useFavorites();
  const { addItem } = useCart();

  const formatPrice = (price: string) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(parseInt(price.replace(/[^\d]/g, '')));
  };

  const handleRemoveFavorite = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    removeFavorite(id);
  };

  const handleAddToCart = (item: any, e: React.MouseEvent) => {
    e.stopPropagation();
    addItem({
      id: item.id,
      name: item.name,
      price: item.price,
      originalPrice: item.originalPrice,
      image: item.image,
      category: item.category,
      rating: item.rating,
      reviews: item.reviews,
    });
  };

  if (!state.isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity duration-300"
        onClick={closeFavorites}
      />

      {/* Favorites Drawer */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 transform transition-transform duration-300 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-pink-500 to-red-500">
          <div className="flex items-center space-x-3">
            <Heart className="w-6 h-6 text-white fill-current" />
            <h2 className="text-xl font-bold text-white">My Favorites</h2>
            <span className="bg-white text-pink-600 rounded-full px-2 py-1 text-sm font-bold">
              {state.count}
            </span>
          </div>
          <button
            onClick={closeFavorites}
            className="p-2 hover:bg-white/20 rounded-full transition-colors duration-200"
          >
            <X className="w-6 h-6 text-white" />
          </button>
        </div>

        {/* Favorites Items */}
        <div className="flex-1 overflow-y-auto p-6">
          {state.items.length === 0 ? (
            <div className="text-center py-12">
              <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No favorites yet</h3>
              <p className="text-gray-500">Start adding jewelry pieces you love!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {state.items.map((item) => (
                <div key={item.id} className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors duration-200">
                  <div className="flex items-start space-x-4">
                    {/* Product Image */}
                    <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 truncate mb-1">{item.name}</h3>
                      <p className="text-sm text-gray-500 mb-2">{item.category}</p>
                      
                      <div className="flex items-center space-x-2 mb-3">
                        <span className="font-bold text-red-600 text-sm">{formatPrice(item.price)}</span>
                        <span className="text-xs text-gray-400 line-through">
                          {formatPrice(item.originalPrice)}
                        </span>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center space-x-2">
                        <AddToCartButton
                          item={{
                            id: item.id,
                            name: item.name,
                            price: item.price,
                            originalPrice: item.originalPrice,
                            image: item.image,
                            category: item.category,
                            rating: item.rating,
                            reviews: item.reviews,
                          }}
                          className="flex-1 py-2 text-xs"
                          showText={false}
                        />
                        
                        <button
                          onClick={(e) => handleRemoveFavorite(item.id, e)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors duration-200"
                          aria-label="Remove from favorites"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Date Added */}
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <p className="text-xs text-gray-400">
                      Added {new Date(item.dateAdded).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        {state.items.length > 0 && (
          <div className="border-t border-gray-200 p-6 bg-gray-50">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-gray-600">
                {state.count} item{state.count !== 1 ? 's' : ''} in favorites
              </span>
              <button
                onClick={() => {
                  state.items.forEach(item => removeFavorite(item.id));
                }}
                className="text-sm text-red-600 hover:text-red-700 font-medium"
              >
                Clear All
              </button>
            </div>
            
            <button
              onClick={() => {
                // Add all favorites to cart
                state.items.forEach(item => {
                  addItem({
                    id: item.id,
                    name: item.name,
                    price: item.price,
                    originalPrice: item.originalPrice,
                    image: item.image,
                    category: item.category,
                    rating: item.rating,
                    reviews: item.reviews,
                  });
                });
                closeFavorites();
              }}
              className="w-full bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 text-white font-bold py-3 rounded-lg transition-all duration-200 transform hover:scale-105 flex items-center justify-center space-x-2"
            >
              <ShoppingCart className="w-5 h-5" />
              <span>Add All to Cart</span>
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default FavoritesDrawer;