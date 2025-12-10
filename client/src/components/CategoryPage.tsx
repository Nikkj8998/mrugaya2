import React, { useState, useEffect } from 'react';
import { useRoute, useLocation } from 'wouter';
import { Grid, List, Filter, SortAsc, Star, Eye, Heart } from 'lucide-react';
import { categories, getProductsByCategory } from '../data/products';
import { Product } from '../types/product';
import AddToCartButton from './AddToCartButton';
import ProductModal from './ProductModal';
import FavoriteButton from './FavoriteButton';

const CategoryPage: React.FC = () => {
  const [, params] = useRoute('/category/:categoryId/:subcategoryId?');
  const [, setLocation] = useLocation();
  const categoryId = params?.categoryId;
  const subcategoryId = params?.subcategoryId;
  const [products, setProducts] = useState<Product[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'name' | 'price' | 'rating'>('name');
  const [filterBy, setFilterBy] = useState<'all' | 'inStock' | 'featured'>('all');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const category = categories.find(cat => cat.id === categoryId);

  useEffect(() => {
    if (categoryId) {
      const categoryProducts = getProductsByCategory(categoryId, subcategoryId);
      setProducts(categoryProducts);
    }
  }, [categoryId, subcategoryId]);

  const filteredAndSortedProducts = products
    .filter(product => {
      if (filterBy === 'inStock') return product.inStock;
      if (filterBy === 'featured') return product.featured;
      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'price':
          return parseInt(a.price.replace(/[^\d]/g, '')) - parseInt(b.price.replace(/[^\d]/g, ''));
        case 'rating':
          return b.rating - a.rating;
        default:
          return a.name.localeCompare(b.name);
      }
    });

  const formatPrice = (price: string) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(parseInt(price.replace(/[^\d]/g, '')));
  };

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleQuickView = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  if (!category) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Category Not Found</h1>
          <button
            onClick={() => setLocation('/')}
            className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative h-64 bg-gradient-to-r from-red-900 to-amber-900">
        <div className="absolute inset-0 bg-black bg-opacity-40" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
          <div>
            <nav className="text-amber-200 text-sm mb-4">
              <button onClick={() => setLocation('/')} className="hover:text-white">Home</button>
              <span className="mx-2">/</span>
              <span className="text-white">{category.name}</span>
              {subcategoryId && (
                <>
                  <span className="mx-2">/</span>
                  <span className="text-white">
                    {category.subcategories.find(sub => sub.id === subcategoryId)?.name}
                  </span>
                </>
              )}
            </nav>
            <h1 className="text-4xl font-serif font-bold text-white mb-2">
              {subcategoryId 
                ? category.subcategories.find(sub => sub.id === subcategoryId)?.name 
                : category.name}
            </h1>
            <p className="text-amber-100 text-lg max-w-2xl">
              {subcategoryId 
                ? category.subcategories.find(sub => sub.id === subcategoryId)?.description 
                : category.description}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Subcategories (if viewing main category) */}
        {!subcategoryId && category.subcategories.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Browse by Category</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {category.subcategories.map((subcategory) => (
                <button
                  key={subcategory.id}
                  onClick={() => setLocation(`/category/${categoryId}/${subcategory.id}`)}
                  className="group bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden"
                >
                  <div className="aspect-square bg-gray-100 overflow-hidden">
                    <img
                      src={subcategory.image}
                      alt={subcategory.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-3">
                    <h3 className="font-medium text-gray-900 text-sm">{subcategory.name}</h3>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Filters and Controls */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 space-y-4 md:space-y-0">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-gray-600" />
              <select
                value={filterBy}
                onChange={(e) => setFilterBy(e.target.value as any)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <option value="all">All Products</option>
                <option value="inStock">In Stock</option>
                <option value="featured">Featured</option>
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <SortAsc className="w-5 h-5 text-gray-600" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <option value="name">Sort by Name</option>
                <option value="price">Sort by Price</option>
                <option value="rating">Sort by Rating</option>
              </select>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-600'}`}
            >
              <Grid className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-600'}`}
            >
              <List className="w-5 h-5" />
            </button>
            <span className="text-gray-600 ml-4">
              {filteredAndSortedProducts.length} products found
            </span>
          </div>
        </div>

        {/* Products Grid/List */}
        {filteredAndSortedProducts.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-gray-400 mb-4">
              <Grid className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-600">Try adjusting your filters or browse other categories.</p>
          </div>
        ) : (
          <div className={viewMode === 'grid' 
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
            : 'space-y-6'
          }>
            {filteredAndSortedProducts.map((product) => (
              <div
                key={product.id}
                className={`group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer ${
                  viewMode === 'list' ? 'flex' : ''
                }`}
                onClick={() => handleProductClick(product)}
              >
                {/* Product Image */}
                <div className={`relative overflow-hidden ${
                  viewMode === 'list' ? 'w-48 flex-shrink-0' : 'aspect-square'
                }`}>
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  
                  {/* Overlay Actions */}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex space-x-2">
                      <button
                        onClick={(e) => handleQuickView(e, product)}
                        className="bg-white text-gray-900 p-2 rounded-full hover:bg-gray-100 transition-colors"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                      <button className="bg-white text-red-600 p-2 rounded-full hover:bg-gray-100 transition-colors">
                        <Heart className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  {/* Badges */}
                  <div className="absolute top-3 left-3 flex flex-col space-y-2">
                    {product.featured && (
                      <span className="bg-amber-500 text-white px-2 py-1 rounded text-xs font-bold">
                        Featured
                      </span>
                    )}
                    {!product.inStock && (
                      <span className="bg-red-500 text-white px-2 py-1 rounded text-xs font-bold">
                        Out of Stock
                      </span>
                    )}
                  </div>

                  {/* Discount Badge */}
                  <div className="absolute top-3 right-3">
                    <div className="bg-white p-2 rounded-full hover:bg-gray-100 transition-colors">
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
                  </div>
                </div>

                {/* Product Info */}
                <div className={`p-4 ${viewMode === 'list' ? 'flex-1' : ''}`}>
                  <div className="flex items-center mb-2">
                    <div className="flex items-center text-amber-500 mr-2">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'fill-current' : ''}`} />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600">({product.reviews})</span>
                  </div>

                  <h3 className="font-serif font-bold text-gray-900 mb-2 group-hover:text-red-800 transition-colors">
                    {product.name}
                  </h3>

                  {viewMode === 'list' && (
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {product.description}
                    </p>
                  )}

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <span className="text-xl font-bold text-red-600">{formatPrice(product.price)}</span>
                      <span className="text-sm text-gray-400 line-through">{formatPrice(product.originalPrice)}</span>
                    </div>
                  </div>

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
                    className="w-full py-2"
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Product Modal */}
      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedProduct(null);
          }}
        />
      )}
    </div>
  );
};

export default CategoryPage;