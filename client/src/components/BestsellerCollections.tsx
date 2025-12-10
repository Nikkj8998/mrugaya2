import React, { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import { useLocation } from 'wouter';
import ProductCard from './ProductCard';
import ProductModal from './ProductModal';
import AOS from 'aos';
import 'aos/dist/aos.css';

const BestsellerCollections = () => {
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [, setLocation] = useLocation();

  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: 'ease-in-out',
      once: true,
      offset: 120
    });
  }, []);

  const collections = [
    {
      id: 1,
      name: 'Royal Thushi Set',
      price: '₹1',
      originalPrice: '₹55000',
      image: '/Thushi.jpeg',
      rating: 4.8,
      reviews: 124,
      category: 'Traditional',
      description: 'Exquisite traditional Thushi set crafted with finest gold and precious stones, perfect for weddings and special occasions.'
    },
    {
      id: 2,
      name: 'Earrings',
      price: '₹1',
      originalPrice: '₹95000',
      image: '/e1.jfif',
      rating: 4.9,
      reviews: 89,
      category: 'Premium',
      description: 'Royal Moti Earrings inspired by Maharashtrian queens, featuring intricate designs and premium work.'
    },
    {
      id: 3,
      name: 'Heritage Bangles',
      price: '₹1',
      originalPrice: '₹38000',
      image: '/b1.webp',
      rating: 4.7,
      reviews: 67,
      category: 'Bridal',
      description: 'Traditional gold Polish bangles with heritage motifs, a symbol of prosperity and marital bliss.'
    },
    {
      id: 4,
      name: 'Mangalsutra',
      price: '₹1',
      originalPrice: '₹22000',
      image: '/m1.png',
      rating: 4.6,
      reviews: 156,
      category: 'Traditional',
      description: 'Sacred temple-inspired Mangalsutra featuring divine motifs and traditional craftsmanship.'
    },
    {
      id: 5,
      name: 'Traditional Nath',
      price: '₹1',
      originalPrice: '₹32000',
      image: '/n3.jfif',
      rating: 4.8,
      reviews: 93,
      category: 'Bridal',
      description: 'Elegant Nath with precious Moti, perfect for bridal occasions and festivals.'
    },
    {
      id: 6,
      name: 'Diamoand Mangalsutra',
      price: '₹1',
      originalPrice: '₹42000',
      image: '/m2.png',
      rating: 4.7,
      reviews: 78,
      category: 'Heritage',
      description: 'Antique-style Mangalsutra with traditional patterns, showcasing the rich heritage of Maharashtrian jewelry.'
    }
  ];

  const handleQuickView = (product: any) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  return (
    <section className="py-16 bg-gradient-to-b from-amber-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-red-100 text-red-800 rounded-full text-sm font-medium mb-4">
            <Star className="w-4 h-4 mr-2" />
            Bestseller Collections
          </div>
          <h2 className="text-4xl lg:text-5xl font-serif font-bold text-gray-900 mb-6">
            Most Loved
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-amber-600"> Creations</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover our customers' favorite pieces, each crafted with meticulous attention to detail 
            and inspired by centuries of Maharashtrian artistry.
          </p>
        </div>

        {/* Collections Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {collections.map((product, index) => {
            // Unique animation effects for variety
            const animations = ['fade-up-right', 'zoom-in-down', 'flip-left', 'slide-up', 'fade-down-left', 'zoom-out-up'];
            return (
              <div
                key={product.id}
                data-aos={animations[index % animations.length]}
                data-aos-delay={index * 150}
                data-aos-duration="1000"
                className="transform scale-110" 
              >
                <ProductCard
                  product={product}
                  onQuickView={handleQuickView}
                  className="border-2 border-red-600/20 shadow-red-100"
                />
              </div>
            );
          })}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <button 
            onClick={() => setLocation('/categories')}
            className="group relative bg-gradient-to-r from-yellow-600 via-yellow-500 to-amber-500 hover:from-amber-600 hover:via-yellow-600 hover:to-yellow-700 text-white font-bold py-4 px-8 rounded-full transition-all duration-500 transform hover:scale-110 hover:rotate-3 shadow-lg hover:shadow-2xl overflow-hidden"
            data-testid="button-view-all-collections"
          >
            <span className="relative z-10 flex items-center justify-center space-x-2">
              <span className="text-lg">💎</span>
              <span>View All Collections</span>
              <span className="text-lg">✨</span>
            </span>
            {/* Moving shine effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
            {/* Golden glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-300/0 via-yellow-200/30 to-yellow-300/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </button>
        </div>
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
    </section>
  );
};

export default BestsellerCollections;