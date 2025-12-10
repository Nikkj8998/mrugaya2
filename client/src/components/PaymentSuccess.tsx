import React, { useEffect, useState } from 'react';
import { CheckCircle, Download, ArrowLeft, Package } from 'lucide-react';
import { getOrderDetails, formatAmount } from '../services/razorpayService';
import { OrderData } from '../types/payment';

const PaymentSuccess: React.FC = () => {
  const [orderData, setOrderData] = useState<OrderData | null>(null);
  const [isVerifying, setIsVerifying] = useState(true);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const orderId = urlParams.get('orderId');
    
    if (orderId) {
      loadOrderDetails(orderId);
    }
  }, []);

  const loadOrderDetails = async (orderId: string) => {
    try {
      const order = getOrderDetails(orderId);
      setOrderData(order);
    } catch (error) {
      console.error('Order loading failed:', error);
    } finally {
      setIsVerifying(false);
    }
  };

  const downloadReceipt = () => {
    // Generate and download receipt
    if (!orderData) return;
    
    const dataStr = JSON.stringify(orderData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `receipt-${orderData.orderId}.json`;
    link.click();
  };

  if (isVerifying) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Verifying payment...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Success Header */}
          <div className="bg-gradient-to-r from-green-500 to-green-600 px-8 py-12 text-center">
            <CheckCircle className="w-20 h-20 text-white mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-white mb-2">Payment Successful!</h1>
            <p className="text-green-100">Your order has been confirmed and is being processed</p>
          </div>

          {/* Payment Details */}
          <div className="px-8 py-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Order ID</h3>
                <p className="text-gray-600 font-mono text-sm">
                  {orderData?.orderId || 'ORD123456789'}
                </p>
              </div>
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Amount Paid</h3>
                <p className="text-2xl font-bold text-green-600">
                  {orderData ? formatAmount(orderData.amount) : '₹0'}
                </p>
              </div>
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Payment Method</h3>
                <p className="text-gray-600">
                  {orderData?.paymentMethod === 'razorpay' ? 'Razorpay (UPI/Card)' : 'Cash on Delivery'}
                </p>
              </div>
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Date & Time</h3>
                <p className="text-gray-600">
                  Order confirmation has been sent to {orderData?.customerInfo.email || 'your email'}
                </p>
              </div>
            </div>

            {/* Next Steps */}
            <div className="bg-blue-50 rounded-lg p-6 mb-8">
              <div className="flex items-start space-x-3">
                <Package className="w-6 h-6 text-blue-600 mt-1" />
                <div>
                  <h3 className="font-medium text-blue-900 mb-2">What happens next?</h3>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Order confirmation email sent to your registered email</li>
                    <li>• Your jewelry will be carefully packaged within 2-3 business days</li>
                    <li>• You'll receive tracking information once shipped</li>
                    <li>• Expected delivery: 5-7 business days</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={downloadReceipt}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
              >
                <Download className="w-5 h-5" />
                <span>Download Receipt</span>
              </button>
              
              <button
                onClick={() => window.location.href = '/'}
                className="flex-1 bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-700 hover:to-amber-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Continue Shopping</span>
              </button>
            </div>
          </div>
        </div>

        {/* Support Information */}
        <div className="mt-8 text-center">
          <p className="text-gray-600 mb-2">Need help with your order?</p>
          <p className="text-sm text-gray-500">
            Contact us at <a href="mailto:support@mrugaya.com" className="text-red-600 hover:underline">support@mrugaya.com</a> or call +91-900-000-0000
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;