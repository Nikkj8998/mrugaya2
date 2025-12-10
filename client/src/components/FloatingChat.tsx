import React, { useState } from 'react';
import { X, Send } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';

const FloatingChat = () => {
  const [isWhatsAppOpen, setIsWhatsAppOpen] = useState(false);
  
  // WhatsApp business number and welcome message
  const whatsappNumber = "+918998099889"; // Replace with actual business WhatsApp number
  const welcomeMessage = "Hello! Welcome to Mrugaya Jewelry 🙏\n\nI'm interested in your beautiful traditional Maharashtrian jewelry collection. Could you please help me with more information about your products?";

  const handleWhatsAppClick = () => {
    if (isWhatsAppOpen) {
      // Close the preview
      setIsWhatsAppOpen(false);
    } else {
      // Show preview for 2 seconds then open WhatsApp
      setIsWhatsAppOpen(true);
      setTimeout(() => {
        setIsWhatsAppOpen(false);
        // Open WhatsApp with welcome message
        const encodedMessage = encodeURIComponent(welcomeMessage);
        const whatsappUrl = `https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodedMessage}`;
        window.open(whatsappUrl, '_blank');
      }, 2000);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* WhatsApp Preview Window */}
      {isWhatsAppOpen && (
        <div className="bg-white rounded-2xl shadow-2xl border border-green-200 w-80 h-auto mb-4 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-green-600 to-green-500 text-white p-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                <FaWhatsapp className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <div className="font-bold text-sm">Mrugaya Jewelry</div>
                <div className="text-xs text-green-100">Connect via WhatsApp</div>
              </div>
            </div>
            <button 
              onClick={() => setIsWhatsAppOpen(false)}
              className="hover:bg-white/20 p-1 rounded"
              data-testid="button-close-whatsapp-preview"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Preview Message */}
          <div className="p-4">
            <div className="bg-green-50 rounded-xl p-3 border-l-4 border-green-500">
              <p className="text-sm text-gray-800 mb-2">
                <strong>Welcome Message Preview:</strong>
              </p>
              <p className="text-sm text-gray-700 whitespace-pre-line">
                {welcomeMessage}
              </p>
            </div>
            <div className="text-xs text-gray-500 mt-2 text-center">
              Opening WhatsApp in a moment...
            </div>
          </div>
        </div>
      )}

      {/* Floating WhatsApp Button */}
      <button
        onClick={handleWhatsAppClick}
        className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white p-4 rounded-full shadow-xl transition-all duration-300 transform hover:scale-110 relative group"
        data-testid="button-whatsapp-chat"
        title="Chat with us on WhatsApp"
      >
        {isWhatsAppOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <>
            <FaWhatsapp className="w-6 h-6" />
            {/* Notification Dot */}
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-400 rounded-full animate-pulse"></div>
            {/* Tooltip */}
            <div className="absolute bottom-full right-0 mb-2 px-3 py-1 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
              Chat on WhatsApp
            </div>
          </>
        )}
      </button>
    </div>
  );
};

export default FloatingChat;