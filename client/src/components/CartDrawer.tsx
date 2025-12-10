import React, { useState } from "react";
import { X, Plus, Minus, ShoppingBag, CreditCard } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useAuthContext } from "../context/AuthContext";
import { useLocation } from "wouter";
import PaymentModal from "./PaymentModal";

const CartDrawer = () => {
  const { state, removeItem, updateQuantity, closeCart } = useCart();
  const { isAuthenticated } = useAuthContext();
  const [, setLocation] = useLocation();
  const [showPayment, setShowPayment] = useState(false);

  const formatPrice = (price: string) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
    }).format(parseInt(price.replace(/[^\d]/g, "")));
  };

  const handleCheckout = () => {
    if (state.items.length > 0) {
      if (!isAuthenticated) {
        // Store intent and redirect to login
        sessionStorage.setItem('authRedirectPath', '/');
        sessionStorage.setItem('pendingAction', 'checkout');
        closeCart();
        setLocation('/login');
      } else {
        setShowPayment(true);
      }
    }
  };

  if (!state.isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity duration-300"
        onClick={closeCart}
      />

      {/* Cart Drawer */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 transform transition-transform duration-300 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-red-600 to-amber-600">
          <div className="flex items-center space-x-3">
            <ShoppingBag className="w-6 h-6 text-white" />
            <h2 className="text-xl font-bold text-white">Shopping Cart</h2>
            <span className="bg-white text-red-600 rounded-full px-2 py-1 text-sm font-bold">
              {state.itemCount}
            </span>
          </div>
          <button
            onClick={closeCart}
            className="p-2 hover:bg-white/20 rounded-full transition-colors duration-200"
          >
            <X className="w-6 h-6 text-white" />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-6">
          {state.items.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Your cart is empty
              </h3>
              <p className="text-gray-500">
                Add some beautiful jewelry to get started!
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {state.items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center space-x-4 bg-gray-50 rounded-lg p-4"
                >
                  <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900 truncate">
                      {item.name}
                    </h3>
                    <p className="text-sm text-gray-500">{item.category}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="font-bold text-red-600">
                        {formatPrice(item.price)}
                      </span>
                      <span className="text-sm text-gray-400 line-through">
                        {formatPrice(item.originalPrice)}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="p-1 hover:bg-gray-200 rounded-full transition-colors duration-200"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-8 text-center font-medium">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="p-1 hover:bg-gray-200 rounded-full transition-colors duration-200"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  <button
                    onClick={() => removeItem(item.id)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors duration-200"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {state.items.length > 0 && (
          <div className="border-t border-gray-200 p-6 bg-gray-50">
            <div className="flex items-center justify-between mb-4">
              <span className="text-lg font-medium text-gray-900">Total:</span>
              <span className="text-2xl font-bold text-red-600">
                {formatPrice(state.total.toString())}
              </span>
            </div>

            <button
              onClick={handleCheckout}
              className="w-full bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-700 hover:to-amber-700 text-white font-bold py-4 rounded-lg transition-all duration-200 transform hover:scale-105 flex items-center justify-center space-x-2"
            >
              <CreditCard className="w-5 h-5" />
              <span>Proceed to Buy</span>
            </button>

            <p className="text-xs text-gray-500 text-center mt-2">
              Secure payment powered by Razorpay
            </p>
          </div>
        )}
      </div>

      {/* Payment Modal */}
      {showPayment && (
        <PaymentModal
          isOpen={showPayment}
          onClose={() => setShowPayment(false)}
          cartItems={state.items}
          total={state.total}
        />
      )}
    </>
  );
};

export default CartDrawer;
