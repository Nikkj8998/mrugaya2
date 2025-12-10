import React, { useState } from 'react';
import { X, Star, Heart, Share2, Truck, Shield, RotateCcw, Award, Eye, EyeOff } from 'lucide-react';
import { Product } from '../types/product';
import AddToCartButton from './AddToCartButton';
import FavoriteButton from './FavoriteButton';

interface ProductModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
}

const ProductModal: React.FC<ProductModalProps> = ({ product, isOpen, onClose }) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [viewMode, setViewMode] = useState<'product' | 'model'>('product');
  const [activeTab, setActiveTab] = useState<'description' | 'specifications' | 'reviews'>('description');

  const formatPrice = (price: string) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(parseInt(price.replace(/[^\d]/g, '')));
  };

  const currentImage = viewMode === 'model' && product.modelImage 
    ? product.modelImage 
    : product.images[selectedImageIndex];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-[70] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-serif font-bold text-gray-900">{product.name}</h2>
          <div className="flex items-center space-x-2">
            <div className="p-2 hover:bg-gray-100 rounded-full transition-colors">
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
                size="md"
              />
            </div>
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <Share2 className="w-5 h-5 text-gray-600" />
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-6 h-6 text-gray-600" />
            </button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row overflow-y-auto max-h-[calc(90vh-80px)]">
          {/* Image Section */}
          <div className="lg:w-1/2 p-6">
            {/* View Mode Toggle */}
            <div className="flex items-center justify-center mb-4 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('product')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-all duration-200 ${
                  viewMode === 'product' 
                    ? 'bg-white text-red-600 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Eye className="w-4 h-4" />
                <span>Product View</span>
              </button>
              {product.modelImage && (
                <button
                  onClick={() => setViewMode('model')}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-all duration-200 ${
                    viewMode === 'model' 
                      ? 'bg-white text-red-600 shadow-sm' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <EyeOff className="w-4 h-4" />
                  <span>View as Model</span>
                </button>
              )}
            </div>

            {/* Main Image */}
            <div className="aspect-square bg-gray-100 rounded-xl overflow-hidden mb-4">
              <img
                src={currentImage}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Thumbnail Images */}
            {viewMode === 'product' && (
              <div className="flex space-x-2 overflow-x-auto">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                      selectedImageIndex === index ? 'border-red-600' : 'border-gray-200'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Model View Info */}
            {viewMode === 'model' && product.modelImage && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Eye className="w-5 h-5 text-amber-600" />
                  <h4 className="font-medium text-amber-900">Model View</h4>
                </div>
                <p className="text-sm text-amber-800">
                  See how this beautiful piece looks when worn. This gives you a better idea of the jewelry's appearance and proportions.
                </p>
              </div>
            )}
          </div>

          {/* Product Details Section */}
          <div className="lg:w-1/2 p-6 border-l border-gray-200">
            {/* Rating and Reviews */}
            <div className="flex items-center mb-4">
              <div className="flex items-center text-amber-500 mr-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`w-5 h-5 ${i < Math.floor(product.rating) ? 'fill-current' : ''}`} />
                ))}
              </div>
              <span className="text-gray-600">({product.reviews} reviews)</span>
              <span className="ml-2 text-sm text-green-600 font-medium">
                {product.inStock ? 'In Stock' : 'Out of Stock'}
              </span>
            </div>

            {/* Price */}
            <div className="mb-6">
              <div className="flex items-center space-x-3 mb-2">
                <span className="text-3xl font-bold text-red-600">{formatPrice(product.price)}</span>
                <span className="text-xl text-gray-400 line-through">{formatPrice(product.originalPrice)}</span>
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm font-medium">
                  {Math.round((1 - parseInt(product.price.replace(/[^\d]/g, '')) / parseInt(product.originalPrice.replace(/[^\d]/g, ''))) * 100)}% OFF
                </span>
              </div>
              <p className="text-sm text-gray-600">Inclusive of all taxes</p>
            </div>

            {/* Add to Cart */}
            <div className="mb-8">
              <AddToCartButton
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
                className="w-full py-4 text-lg"
                disabled={!product.inStock}
              />
              
              <button className="w-full mt-3 border-2 border-red-600 text-red-600 hover:bg-red-600 hover:text-white font-bold py-4 rounded-lg transition-all duration-200">
                Buy Now
              </button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Truck className="w-4 h-4" />
                <span>Free Delivery</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Shield className="w-4 h-4" />
                <span>Lifetime Warranty</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <RotateCcw className="w-4 h-4" />
                <span>Easy Returns</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Award className="w-4 h-4" />
                <span>Certified Quality</span>
              </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200 mb-6">
              <nav className="flex space-x-8">
                {['description', 'specifications', 'reviews'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab as any)}
                    className={`py-2 px-1 border-b-2 font-medium text-sm capitalize transition-colors ${
                      activeTab === tab
                        ? 'border-red-600 text-red-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </nav>
            </div>

            {/* Tab Content */}
            <div className="space-y-4">
              {activeTab === 'description' && (
                <div>
                  <p className="text-gray-700 leading-relaxed mb-4">{product.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {product.tags.map((tag) => (
                      <span
                        key={tag}
                        className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'specifications' && (
                <div className="space-y-3">
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="font-medium text-gray-900">Material:</span>
                    <span className="text-gray-700">{product.specifications.material}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="font-medium text-gray-900">Weight:</span>
                    <span className="text-gray-700">{product.specifications.weight}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="font-medium text-gray-900">Dimensions:</span>
                    <span className="text-gray-700">{product.specifications.dimensions}</span>
                  </div>
                  {product.specifications.purity && (
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="font-medium text-gray-900">Purity:</span>
                      <span className="text-gray-700">{product.specifications.purity}</span>
                    </div>
                  )}
                  {product.specifications.gemstones && (
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="font-medium text-gray-900">Gemstones:</span>
                      <span className="text-gray-700">{product.specifications.gemstones.join(', ')}</span>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'reviews' && (
                <div>
                  <div className="text-center py-8">
                    <Star className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No reviews yet</h3>
                    <p className="text-gray-600">Be the first to review this product!</p>
                    <button className="mt-4 bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors">
                      Write a Review
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;