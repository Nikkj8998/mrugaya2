import React from 'react';
import { Crown, Gem, Shield, Award } from 'lucide-react';

const CulturalHighlights = () => {
  const features = [
    {
      icon: Crown,
      title: 'Royal Heritage',
      description: 'Each piece carries the legacy of Maratha royalty and traditional craftsmanship'
    },
    {
      icon: Gem,
      title: 'Premium Quality',
      description: 'Certified gold and precious stones sourced from the finest suppliers'
    },
    {
      icon: Shield,
      title: 'Lifetime Warranty',
      description: 'Complete protection and maintenance for all our jewelry pieces'
    },
    {
      icon: Award,
      title: 'Master Craftsmen',
      description: 'Handcrafted by skilled artisans with generations of expertise'
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-red-900 via-purple-900 to-amber-900 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-black bg-opacity-40"></div>
      <div 
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M50 10L60 40L90 40L67.5 57.5L75 87.5L50 70L25 87.5L32.5 57.5L10 40L40 40L50 10Z' fill='%23FFD700' fill-opacity='0.1'/%3E%3C/svg%3E")`,
        }}
      ></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div>
            <div className="mb-8">
              <span className="inline-block px-4 py-2 bg-amber-500 text-black rounded-full text-sm font-bold mb-4">
                Traditional Excellence Since 2002
              </span>
              <h2 className="text-4xl lg:text-5xl font-serif font-bold text-white mb-6 leading-tight">
                Thushi & 
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-300">
                  {" "}Maharashtrian Treasures
                </span>
              </h2>
              <p className="text-xl text-amber-100 mb-8 leading-relaxed">
                Immerse yourself in the rich cultural heritage of Maharashtra with our authentic Jewellary collections 
                and traditional ornaments that have adorned generations of royal families.
              </p>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start space-x-4 p-4 bg-white/10 rounded-lg backdrop-blur-sm border border-amber-200/20">
                  <div className="flex-shrink-0">
                    <feature.icon className="w-8 h-8 text-amber-400" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white mb-2">{feature.title}</h3>
                    <p className="text-amber-100 text-sm">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8">
              <button className="bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-black font-bold py-4 px-8 rounded-full transition-all duration-300 transform hover:scale-105 shadow-xl">
                Explore Thushi Collection
              </button>
            </div>
          </div>

          {/* Right Content - Images */}
          <div className="relative">
            <div className="grid grid-cols-2 gap-4">
              {/* Large Image */}
              <div className="col-span-2 relative">
                <div className="aspect-video rounded-2xl overflow-hidden shadow-2xl">
                  <img
                    src="/hero3.jpeg"
                    alt="Traditional Thushi Collection"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="font-serif font-bold text-lg">Traditional Thushi Set</h3>
                    <p className="text-amber-200">Authentic Maharashtrian Design</p>
                  </div>
                </div>
              </div>

              {/* Small Images */}
              <div className="aspect-square rounded-xl overflow-hidden shadow-xl">
                <img
                  src="/hero1.jpeg"
                  alt="Heritage Jewelry"
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                />
              </div>
              <div className="aspect-square rounded-xl overflow-hidden shadow-xl">
                <img
                  src="/hero2.jpeg"
                  alt="Royal Ornaments"
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                />
              </div>
            </div>

            {/* Floating Elements */}
            <div className="absolute -top-4 -left-4 w-16 h-16 bg-amber-400 rounded-full opacity-80 animate-pulse"></div>
            <div className="absolute -bottom-4 -right-4 w-12 h-12 bg-purple-500 rounded-full opacity-60 animate-pulse"></div>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-3xl font-bold text-amber-400 mb-2">25+</div>
            <div className="text-amber-100 font-medium">Years of Heritage</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-amber-400 mb-2">5000+</div>
            <div className="text-amber-100 font-medium">Happy Customers</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-amber-400 mb-2">25+</div>
            <div className="text-amber-100 font-medium">Master Artisans</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-amber-400 mb-2">99.9%</div>
            <div className="text-amber-100 font-medium">Trust Purity</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CulturalHighlights;