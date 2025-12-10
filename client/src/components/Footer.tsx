import React from 'react';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Facebook, 
  Instagram, 
  Twitter, 
  Youtube,
  Shield,
  Ruler,
  RotateCcw,
  Award,
  Sparkles,
  Heart
} from 'lucide-react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: 'Jewelry Care Guide', icon: Sparkles, href: '#care-guide' },
    { name: 'Size Guide', icon: Ruler, href: '#size-guide' },
    { name: 'Return & Exchange', icon: RotateCcw, href: '#returns' },
    { name: 'Warranty Information', icon: Shield, href: '#warranty' },
    { name: 'Custom Jewelry', icon: Award, href: '#custom' }
  ];

  const socialLinks = [
    { name: 'Facebook', icon: Facebook, href: '#', color: 'hover:text-blue-600' },
    { name: 'Instagram', icon: Instagram, href: '#', color: 'hover:text-pink-600' },
    { name: 'Twitter', icon: Twitter, href: '#', color: 'hover:text-blue-400' },
    { name: 'YouTube', icon: Youtube, href: '#', color: 'hover:text-red-600' }
  ];

  const collections = [
    'Traditional Thushi',
    'Bridal Collections',
    'Temple Jewelry',
    'Antique Designs',
    'Modern Fusion',
    'Custom Pieces'
  ];

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div 
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23FFD700' fill-opacity='0.1'%3E%3Cpath d='M30 10L35 20L45 20L37.5 27.5L40 37.5L30 32.5L20 37.5L22.5 27.5L15 20L25 20L30 10Z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <div className="relative z-10">
        {/* Main Footer Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
            
            {/* Company Information */}
            <div className="lg:col-span-1 space-y-6">
              <div className="flex items-center space-x-3">
                <img 
                  src="/logo4.png" 
                  alt="Mrugaya Logo" 
                  className="h-16 w-autoz"
                />
                <div>
                  <h3 className="text-2xl font-serif font-bold text-amber-400">मृगया</h3>
                  <p className="text-sm text-gray-300">Heritage Since 1992</p>
                </div>
              </div>
              
              <p className="text-gray-300 leading-relaxed">
                Crafting exquisite Maharashtrian jewelry with traditional artistry and modern elegance. 
                Each piece tells a story of heritage, culture, and timeless beauty.
              </p>

              {/* Social Media Links */}
              <div className="flex space-x-4">
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    className={`p-3 bg-gray-800 rounded-full transition-all duration-300 transform hover:scale-110 ${social.color}`}
                    aria-label={social.name}
                  >
                    <social.icon className="w-5 h-5" />
                  </a>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div className="space-y-6">
              <h4 className="text-xl font-bold text-amber-400 border-b border-amber-400/30 pb-2">
                Customer Care
              </h4>
              <ul className="space-y-3">
                {quickLinks.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="flex items-center space-x-3 text-gray-300 hover:text-amber-400 transition-colors duration-200 group"
                    >
                      <link.icon className="w-4 h-4 group-hover:text-amber-400" />
                      <span>{link.name}</span>
                    </a>
                  </li>
                ))}
              </ul>

              {/* Collections */}
              <div className="mt-8">
                <h5 className="text-lg font-semibold text-white mb-4">Our Collections</h5>
                <ul className="space-y-2">
                  {collections.map((collection) => (
                    <li key={collection}>
                      <a
                        href="#"
                        className="text-gray-400 hover:text-amber-400 transition-colors duration-200 text-sm"
                      >
                        {collection}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-6">
              <h4 className="text-xl font-bold text-amber-400 border-b border-amber-400/30 pb-2">
                Contact Information
              </h4>
              
              <div className="space-y-4">
                {/* Address */}
                <div className="flex items-start space-x-3">
                  <MapPin className="w-5 h-5 text-amber-400 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-white font-medium">Visit Our Store</p>
                    <address className="text-gray-300 not-italic leading-relaxed">
                      123 Heritage Street,<br />
                      Jewelry Quarter,<br />
                      Pune, Maharashtra 411001<br />
                      India
                    </address>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-amber-400" />
                  <div>
                    <p className="text-white font-medium">Call Us</p>
                    <a 
                      href="tel:+919876543210" 
                      className="text-gray-300 hover:text-amber-400 transition-colors duration-200"
                    >
                      +91 900 000 0000
                    </a>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-amber-400" />
                  <div>
                    <p className="text-white font-medium">Email Us</p>
                    <a 
                      href="mailto:info@mrugaya.com" 
                      className="text-gray-300 hover:text-amber-400 transition-colors duration-200"
                    >
                      info@mrugaya.com
                    </a>
                  </div>
                </div>

                {/* Business Hours */}
                <div className="flex items-start space-x-3">
                  <Clock className="w-5 h-5 text-amber-400 mt-1" />
                  <div>
                    <p className="text-white font-medium">Business Hours</p>
                    <div className="text-gray-300 text-sm space-y-1">
                      <p>Monday - Saturday: 10:00 AM - 8:00 PM</p>
                      <p>Sunday: 11:00 AM - 6:00 PM</p>
                      <p className="text-amber-400">Closed on major festivals</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Map Integration */}
            <div className="space-y-6">
              <h4 className="text-xl font-bold text-amber-400 border-b border-amber-400/30 pb-2">
                Find Us
              </h4>
              
              {/* Interactive Map */}
              <div className="relative">
                <div className="aspect-video rounded-lg overflow-hidden border-2 border-amber-400/30">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3783.2612404153894!2d73.8567437!3d18.5204303!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2c147b8b3a3bf%3A0x6f7fdcc8e4d6c77e!2sPune%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1635000000000!5m2!1sen!2sin"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Mrugaya Jewelry Store Location"
                    className="filter grayscale hover:grayscale-0 transition-all duration-300"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none rounded-lg" />
              </div>

              {/* Newsletter Signup */}
              <div className="bg-gradient-to-r from-amber-600/20 to-red-600/20 rounded-lg p-6 border border-amber-400/30">
                <div className="flex items-center space-x-2 mb-3">
                  <Heart className="w-5 h-5 text-amber-400" />
                  <h5 className="text-lg font-semibold text-white">Stay Connected</h5>
                </div>
                <p className="text-gray-300 text-sm mb-4">
                  Subscribe to receive updates on new collections and exclusive offers.
                </p>
                <div className="flex space-x-2">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="flex-1 px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-amber-400 transition-colors duration-200"
                  />
                  <button className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-black font-medium px-4 py-2 rounded-lg transition-all duration-200 transform hover:scale-105">
                    Subscribe
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

       
        {/* Bottom Bar */}
        <div className="border-t border-gray-700 bg-black/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <div className="text-center md:text-left">
                <p className="text-gray-400 text-sm">
                  © {currentYear} Mrugaya - मृगया. All rights reserved.
                </p>
                <p className="text-gray-500 text-xs mt-1">
                  Crafted with <Heart className="w-3 h-3 inline text-red-500" /> by CybaemTech
                </p>
              </div>
              
              <div className="flex flex-wrap justify-center md:justify-end space-x-6 text-sm">
                <a href="#privacy" className="text-gray-400 hover:text-amber-400 transition-colors duration-200">
                  Privacy Policy
                </a>
                <a href="#terms" className="text-gray-400 hover:text-amber-400 transition-colors duration-200">
                  Terms of Service
                </a>
                <a href="#cookies" className="text-gray-400 hover:text-amber-400 transition-colors duration-200">
                  Cookie Policy
                </a>
                <a href="#sitemap" className="text-gray-400 hover:text-amber-400 transition-colors duration-200">
                  Sitemap
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;