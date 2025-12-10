import React, { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { CheckCircle, Package, Truck, Calendar, Copy, ArrowRight } from 'lucide-react';

export function OrderSuccess() {
  const [, setLocation] = useLocation();
  const [orderDetails, setOrderDetails] = useState({
    orderId: '',
    type: '',
    amount: '',
    delivery: ''
  });

  useEffect(() => {
    // Get order details from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    setOrderDetails({
      orderId: urlParams.get('orderId') || '',
      type: urlParams.get('type') || '',
      amount: urlParams.get('amount') || '',
      delivery: urlParams.get('delivery') || ''
    });
  }, []);

  const copyOrderId = () => {
    navigator.clipboard.writeText(orderDetails.orderId);
    alert("Order ID copied to clipboard!");
  };

  const getPaymentMethodText = () => {
    switch (orderDetails.type) {
      case 'cod':
        return 'Cash on Delivery';
      case 'razorpay':
        return 'Online Payment';
      default:
        return 'Payment';
    }
  };

  const getDeliverySteps = () => {
    if (orderDetails.type === 'cod') {
      return [
        { icon: CheckCircle, title: 'Order Confirmed', desc: 'Your order has been placed successfully', completed: true },
        { icon: Package, title: 'Processing', desc: 'We are preparing your jewelry', completed: false },
        { icon: Truck, title: 'Shipped', desc: 'Your order will be dispatched soon', completed: false },
        { icon: Calendar, title: 'Delivered', desc: `Expected by ${orderDetails.delivery}`, completed: false }
      ];
    } else {
      return [
        { icon: CheckCircle, title: 'Payment Verified', desc: 'Your payment has been confirmed', completed: true },
        { icon: Package, title: 'Processing', desc: 'We are preparing your jewelry', completed: false },
        { icon: Truck, title: 'Shipped', desc: 'Your order will be dispatched soon', completed: false },
        { icon: Calendar, title: 'Delivered', desc: `Expected by ${orderDetails.delivery}`, completed: false }
      ];
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          
          {/* Success Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full mb-4">
              <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Order Placed Successfully!
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Thank you for your purchase. Your order has been confirmed.
            </p>
          </div>

          {/* Order Details Card */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 mb-8">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Order Details</h3>
                <span className="text-sm font-normal text-green-600 dark:text-green-400">
                  ✓ Confirmed
                </span>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Order ID</p>
                    <div className="flex items-center gap-2">
                      <p className="font-mono font-medium">{orderDetails.orderId}</p>
                      <button
                        onClick={copyOrderId}
                        className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                      >
                        <Copy className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Payment Method</p>
                    <p className="font-medium">{getPaymentMethodText()}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Total Amount</p>
                    <p className="font-bold text-lg">₹{parseInt(orderDetails.amount || '0').toLocaleString()}</p>
                  </div>
                  
                  {orderDetails.delivery && (
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Expected Delivery</p>
                      <p className="font-medium">{orderDetails.delivery}</p>
                    </div>
                  )}
                </div>
              </div>

              {orderDetails.type === 'cod' && (
                <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg mt-4">
                  <h4 className="font-medium text-amber-800 dark:text-amber-200 mb-2">
                    Cash on Delivery Instructions
                  </h4>
                  <ul className="text-sm text-amber-700 dark:text-amber-300 space-y-1">
                    <li>• Keep exact amount ready: ₹{parseInt(orderDetails.amount || '0').toLocaleString()}</li>
                    <li>• Verify the product before making payment</li>
                    <li>• COD handling fee is included in the total amount</li>
                    <li>• Please be available at the delivery address</li>
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Order Progress */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 mb-8">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-medium">Order Progress</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {getDeliverySteps().map((step, index) => {
                  const Icon = step.icon;
                  return (
                    <div key={index} className="flex items-start gap-4">
                      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                        step.completed 
                          ? 'bg-green-100 dark:bg-green-900/20' 
                          : 'bg-gray-100 dark:bg-gray-800'
                      }`}>
                        <Icon className={`w-4 h-4 ${
                          step.completed 
                            ? 'text-green-600 dark:text-green-400' 
                            : 'text-gray-400 dark:text-gray-500'
                        }`} />
                      </div>
                      <div className="flex-1">
                        <h4 className={`font-medium ${
                          step.completed 
                            ? 'text-green-900 dark:text-green-100' 
                            : 'text-gray-900 dark:text-gray-100'
                        }`}>
                          {step.title}
                        </h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {step.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => setLocation('/')}
              className="flex items-center gap-2 justify-center px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 font-medium rounded-md transition-colors duration-200"
              data-testid="button-continue-shopping"
            >
              Continue Shopping
              <ArrowRight className="w-4 h-4" />
            </button>
            
            <button
              onClick={() => setLocation('/orders')}
              className="flex items-center gap-2 justify-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors duration-200"
              data-testid="button-view-orders"
            >
              View All Orders
              <Package className="w-4 h-4" />
            </button>
          </div>

          {/* Contact Information */}
          <div className="text-center mt-8 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
            <h3 className="font-medium text-gray-900 dark:text-white mb-2">
              Need Help?
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
              If you have any questions about your order, please contact us.
            </p>
            <div className="flex flex-col sm:flex-row gap-2 justify-center text-sm">
              <span className="text-gray-500 dark:text-gray-400">Email: support@mrugaya.com</span>
              <span className="hidden sm:inline text-gray-300 dark:text-gray-600">|</span>
              <span className="text-gray-500 dark:text-gray-400">Phone: +91 98765 43210</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}