import { useEffect } from 'react';
import { useLocation } from 'wouter';
import { Sparkles } from 'lucide-react';
import { categories } from '../data/products';
import AOS from 'aos';
import 'aos/dist/aos.css';

const CategoriesPage = () => {
  const [, setLocation] = useLocation();

  useEffect(() => {
    // Initialize AOS
    AOS.init({
      duration: 1200,
      easing: 'ease-out-cubic',
      once: true,
      offset: 100
    });
  }, []);

  // Fix scroll to top when component loads
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleCategoryClick = (categoryId: string) => {
    setLocation(`/category/${categoryId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
      {/* Hero Section */}
      <div className="text-center mb-16 px-4 sm:px-6 lg:px-8 py-16">
        <div 
          className="inline-flex items-center px-4 py-2 bg-red-100 text-red-800 rounded-full text-sm font-medium mb-4"
          data-aos="fade-down"
        >
          <Sparkles className="w-4 h-4 mr-2" />
          All Collections
        </div>
        <h1 
          className="text-4xl lg:text-5xl font-serif font-bold text-gray-900 mb-6"
          data-aos="fade-up"
          data-aos-delay="200"
        >
          Browse Our
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-amber-600"> Jewelry Collections</span>
        </h1>
        <p 
          className="text-xl text-gray-600 max-w-3xl mx-auto"
          data-aos="fade-up"
          data-aos-delay="400"
        >
          Discover the finest traditional Maharashtrian jewelry, crafted with love and heritage. 
          Each collection tells a story of timeless elegance and cultural richness.
        </p>
      </div>

      {/* Categories Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-12">
          {categories.map((category, index) => {
            // Elegant jewelry-themed animations
            const jewelryAnimations = [
              'fade-up', // Graceful rise like a precious gem
              'flip-up', // Elegant flip like turning a pendant
              'zoom-in-up', // Zoom with upward elegance
              'fade-down-right' // Gentle cascade like falling pearls
            ];
            return (
              <div
                key={category.id}
                onClick={() => handleCategoryClick(category.id)}
                className="group cursor-pointer transform transition-all duration-700 hover:scale-105 hover:-translate-y-3 hover:rotate-2"
                data-testid={`category-${category.id}`}
                data-aos={jewelryAnimations[index % jewelryAnimations.length]}
                data-aos-delay={index * 200}
                data-aos-duration="1200"
                data-aos-easing="ease-out-cubic"
              >
                {/* Larger Circular Image Container */}
                <div className="relative mb-6">
                  <div className="w-48 h-48 mx-auto rounded-full overflow-hidden border-4 border-amber-300 shadow-xl group-hover:border-amber-400 group-hover:shadow-2xl group-hover:shadow-amber-500/40 transition-all duration-700 bg-gradient-to-br from-amber-50 to-red-50 p-3 group-hover:animate-pulse">
                    <div className="w-full h-full rounded-full overflow-hidden">
                      <img
                        src={category.image}
                        alt={category.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        data-testid={`img-category-${category.id}`}
                      />
                    </div>
                  </div>
                  
                  {/* Jewelry Sparkle Effect */}
                  <div className="absolute inset-0 rounded-full bg-gradient-to-t from-amber-600/0 via-amber-400/0 to-amber-600/0 group-hover:from-amber-600/15 group-hover:via-amber-400/10 group-hover:to-amber-600/15 transition-all duration-700"></div>
                  
                  {/* Elegant Shimmer Border Animation */}
                  <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-amber-400 via-yellow-300 via-amber-500 to-amber-400 animate-pulse" style={{ animationDuration: '2.5s' }}></div>
                    <div className="absolute inset-1 rounded-full bg-gradient-to-b from-amber-25 to-white shadow-inner"></div>
                    <div className="absolute inset-3 rounded-full overflow-hidden">
                      <img
                        src={category.image}
                        alt={category.name}
                        className="w-full h-full object-cover group-hover:brightness-110 transition-all duration-500"
                      />
                    </div>
                  </div>
                  
                  {/* Floating sparkle effects */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="absolute top-4 right-8 w-2 h-2 bg-amber-400 rounded-full animate-ping" style={{ animationDelay: '0.5s' }}></div>
                    <div className="absolute top-12 left-6 w-1 h-1 bg-yellow-300 rounded-full animate-ping" style={{ animationDelay: '1s' }}></div>
                    <div className="absolute bottom-8 right-6 w-1.5 h-1.5 bg-amber-500 rounded-full animate-ping" style={{ animationDelay: '1.5s' }}></div>
                    <div className="absolute bottom-12 left-8 w-1 h-1 bg-yellow-400 rounded-full animate-ping" style={{ animationDelay: '2s' }}></div>
                  </div>

                  {/* Elegant Hover Overlay */}
                  <div className="absolute inset-0 rounded-full bg-gradient-to-t from-amber-900/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-end justify-center pb-8">
                    <span className="text-white text-sm font-medium bg-gradient-to-r from-amber-600 to-amber-700 px-4 py-2 rounded-full backdrop-blur-sm shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                      ✨ View Collection ✨
                    </span>
                  </div>
                </div>

                {/* Category Name */}
                <div className="text-center">
                  <h3 
                    className="text-xl font-serif font-bold text-gray-900 group-hover:text-red-600 transition-colors duration-200 mb-3"
                    data-testid={`text-category-name-${category.id}`}
                  >
                    {category.name}
                  </h3>
                  <p className="text-base text-gray-600 group-hover:text-gray-800 transition-colors duration-200 line-clamp-2">
                    {category.description}
                  </p>
                </div>

                {/* Jewelry-inspired Decorative Elements */}
                <div className="flex justify-center mt-4 space-x-3 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-3 group-hover:translate-y-0">
                  <div className="w-2 h-2 bg-amber-500 rounded-full animate-bounce shadow-sm shadow-amber-300"></div>
                  <div className="w-3 h-3 bg-gradient-to-r from-amber-400 to-yellow-400 rounded-full animate-bounce shadow-md shadow-amber-400" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-amber-500 rounded-full animate-bounce shadow-sm shadow-amber-300" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Featured Section */}
      <div 
        className="bg-gradient-to-r from-red-600 to-amber-600 py-16"
        data-aos="fade-up"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 
            className="text-3xl font-serif font-bold text-white mb-4"
            data-aos="fade-up"
            data-aos-delay="200"
          >
            Handcrafted with Love
          </h2>
          <p 
            className="text-amber-100 text-lg max-w-2xl mx-auto mb-8"
            data-aos="fade-up"
            data-aos-delay="400"
          >
            Every piece in our collection is meticulously crafted by skilled artisans, 
            preserving the traditional techniques passed down through generations.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-white">
            <div 
              className="text-center"
              data-aos="zoom-in"
              data-aos-delay="600"
            >
              <div className="text-3xl font-bold mb-2">100+</div>
              <div className="text-amber-200">Unique Designs</div>
            </div>
            <div 
              className="text-center"
              data-aos="zoom-in"
              data-aos-delay="800"
            >
              <div className="text-3xl font-bold mb-2">500+</div>
              <div className="text-amber-200">Happy Customers</div>
            </div>
            <div 
              className="text-center"
              data-aos="zoom-in"
              data-aos-delay="1000"
            >
              <div className="text-3xl font-bold mb-2">25+</div>
              <div className="text-amber-200">Years of Experience</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoriesPage;