import React, { useState } from 'react';
import { X, CreditCard, Smartphone, Shield, CheckCircle, AlertCircle, Loader, QrCode, Banknote, Copy, Download } from 'lucide-react';
import { CartItem } from '../types/cart';
import { useCart } from '../context/CartContext';
import PaymentVerification from './PaymentVerification';
import { 
  initiateRazorpayPayment, 
  generateUPIQRCode, 
  processCODOrder, 
  formatAmount 
} from '../services/razorpayService';
import { PaymentResponse, CODOrder } from '../types/payment';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  total: number;
}

interface CustomerInfo {
  name: string;
  email: string;
  phone: string;
  address: string;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose, cartItems, total }) => {
  const { clearCart, closeCart } = useCart();
  const [step, setStep] = useState<'details' | 'payment' | 'processing' | 'success' | 'error' | 'qr-code' | 'cod-success'>('details');
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    name: '',
    email: '',
    phone: '',
    address: '',
  });
  const [errors, setErrors] = useState<Partial<CustomerInfo>>({});
  const [paymentResponse, setPaymentResponse] = useState<PaymentResponse | null>(null);
  const [qrCodeData, setQrCodeData] = useState<{ qrCodeUrl: string; orderId: string } | null>(null);
  const [codOrder, setCodOrder] = useState<CODOrder | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showVerification, setShowVerification] = useState(false);
  const [verificationData, setVerificationData] = useState<{ paymentId: string; orderId: string; amount: number } | null>(null);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<CustomerInfo> = {};

    if (!customerInfo.name.trim()) newErrors.name = 'Name is required';
    if (!customerInfo.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(customerInfo.email)) newErrors.email = 'Email is invalid';
    if (!customerInfo.phone.trim()) newErrors.phone = 'Phone is required';
    else if (!/^\d{10}$/.test(customerInfo.phone.replace(/\D/g, ''))) newErrors.phone = 'Phone must be 10 digits';
    if (!customerInfo.address.trim()) newErrors.address = 'Address is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof CustomerInfo, value: string) => {
    setCustomerInfo(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleDigitalPayment = async (paymentMethod: 'phonepe' | 'googlepay' | 'upi' | 'card') => {
    setIsProcessing(true);
    setStep('processing');

    try {
      const response = await initiateRazorpayPayment(
        total,
        customerInfo,
        cartItems,
        paymentMethod
      );

      setPaymentResponse(response);

      if (response.success) {
        // Show payment verification instead of immediate success
        setVerificationData({
          paymentId: response.paymentId!,
          orderId: response.orderId!,
          amount: total,
        });
        setShowVerification(true);
      } else {
        setStep('error');
      }
    } catch (error) {
      console.error('Digital payment error:', error);
      setPaymentResponse({
        success: false,
        message: 'Payment processing failed',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      setStep('error');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleQRCodePayment = async () => {
    setIsProcessing(true);
    setStep('processing');

    try {
      const qrData = await generateUPIQRCode(total, customerInfo, cartItems);
      setQrCodeData(qrData);
      setStep('qr-code');
    } catch (error) {
      console.error('QR Code generation error:', error);
      setPaymentResponse({
        success: false,
        message: 'Failed to generate QR code',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      setStep('error');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCODPayment = async () => {
    setIsProcessing(true);
    setStep('processing');

    try {
      const response = await fetch('/api/cod-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          amount: total,
          customerInfo: {
            ...customerInfo,
            address: `${customerInfo.address}`
          },
          items: cartItems
        })
      });

      const result = await response.json();

      if (result.success) {
        // Clear cart and close modal
        clearCart();
        closeCart();
        onClose();
        
        // Navigate to order success page with order details
        window.location.href = `/order-success?orderId=${result.order.orderId}&type=cod&amount=${result.order.totalAmount}&delivery=${encodeURIComponent(result.order.estimatedDelivery)}`;
      } else {
        throw new Error(result.message || 'Failed to place COD order');
      }
    } catch (error) {
      console.error('COD order error:', error);
      setPaymentResponse({
        success: false,
        message: 'Failed to process COD order',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      setStep('error');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleVerificationComplete = (success: boolean, data?: any) => {
    setShowVerification(false);
    setVerificationData(null);
    
    if (success) {
      // Clear cart and close modal
      clearCart();
      closeCart();
      onClose();
      
      // Navigate to order success page
      window.location.href = `/order-success?orderId=${data?.orderId || 'unknown'}&type=razorpay&amount=${total}&delivery=${encodeURIComponent('7-10 business days')}`;
    } else {
      setStep('error');
      setPaymentResponse({
        success: false,
        message: 'Payment verification failed',
        error: 'Could not verify payment status',
      });
    }
  };

  const handleProceedToPayment = () => {
    if (validateForm()) {
      setStep('payment');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-[60] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-red-600 to-amber-600">
          <h2 className="text-xl font-bold text-white">
            {step === 'details' && 'Customer Details'}
            {step === 'payment' && 'Payment Options'}
            {step === 'processing' && 'Processing Payment'}
            {step === 'success' && 'Payment Successful'}
            {step === 'error' && 'Payment Failed'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-full transition-colors duration-200"
          >
            <X className="w-6 h-6 text-white" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
          {/* Customer Details Step */}
          {step === 'details' && (
            <div className="space-y-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-medium text-gray-900 mb-3">Order Summary</h3>
                <div className="space-y-2">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span>{item.name} × {item.quantity}</span>
                      <span>{formatPrice(parseInt(item.price.replace(/[^\d]/g, '')) * item.quantity)}</span>
                    </div>
                  ))}
                  <div className="border-t pt-2 flex justify-between font-bold">
                    <span>Total:</span>
                    <span className="text-red-600">{formatPrice(total)}</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={customerInfo.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 ${
                      errors.name ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter your full name"
                  />
                  {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    value={customerInfo.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 ${
                      errors.phone ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter 10-digit phone number"
                  />
                  {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={customerInfo.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 ${
                      errors.email ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter your email address"
                  />
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Delivery Address *
                  </label>
                  <textarea
                    value={customerInfo.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    rows={3}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 ${
                      errors.address ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter your complete delivery address"
                  />
                  {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
                </div>
              </div>

              <button
                onClick={handleProceedToPayment}
                className="w-full bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-700 hover:to-amber-700 text-white font-bold py-3 rounded-lg transition-all duration-200 transform hover:scale-105"
              >
                Proceed to Payment
              </button>
            </div>
          )}

          {/* Payment Options Step */}
          {step === 'payment' && (
            <div className="space-y-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-medium text-gray-900 mb-2">Payment Amount</h3>
                <p className="text-2xl font-bold text-red-600">{formatPrice(total)}</p>
              </div>

              <div className="space-y-4">
                <h3 className="font-medium text-gray-900">Choose Payment Method</h3>
                
                {/* PhonePe Payment Option */}
                <button
                  onClick={() => handleDigitalPayment('phonepe')}
                  disabled={isProcessing}
                  className="w-full p-4 border-2 border-purple-200 rounded-lg hover:border-purple-400 transition-colors duration-200 group"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center">
                      <Smartphone className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1 text-left">
                      <h4 className="font-medium text-gray-900 group-hover:text-purple-600">PhonePe</h4>
                      <p className="text-sm text-gray-500">Pay securely with PhonePe UPI</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Shield className="w-5 h-5 text-green-500" />
                      <span className="text-sm text-green-600 font-medium">Secure</span>
                    </div>
                  </div>
                </button>

                {/* UPI QR Code Scanner Option */}
                <button
                  onClick={handleQRCodePayment}
                  disabled={isProcessing}
                  className="w-full p-4 border-2 border-blue-200 rounded-lg hover:border-blue-400 transition-colors duration-200 group"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                      <QrCode className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1 text-left">
                      <h4 className="font-medium text-gray-900 group-hover:text-blue-600">UPI QR Code</h4>
                      <p className="text-sm text-gray-500">Scan QR code with any UPI app</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Shield className="w-5 h-5 text-green-500" />
                      <span className="text-sm text-green-600 font-medium">Instant</span>
                    </div>
                  </div>
                </button>

                {/* Google Pay Option */}
                <button
                  onClick={() => handleDigitalPayment('googlepay')}
                  disabled={isProcessing}
                  className="w-full p-4 border-2 border-green-200 rounded-lg hover:border-green-400 transition-colors duration-200 group"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center">
                      <Smartphone className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1 text-left">
                      <h4 className="font-medium text-gray-900 group-hover:text-green-600">Google Pay</h4>
                      <p className="text-sm text-gray-500">Quick payment with Google Pay</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Shield className="w-5 h-5 text-green-500" />
                      <span className="text-sm text-green-600 font-medium">Fast</span>
                    </div>
                  </div>
                </button>

                {/* Cash on Delivery Option */}
                <button
                  onClick={handleCODPayment}
                  disabled={isProcessing}
                  className="w-full p-4 border-2 border-amber-200 rounded-lg hover:border-amber-400 transition-colors duration-200 group"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-amber-600 rounded-lg flex items-center justify-center">
                      <Banknote className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1 text-left">
                      <h4 className="font-medium text-gray-900 group-hover:text-amber-600">Cash on Delivery</h4>
                      <p className="text-sm text-gray-500">Pay when your order arrives</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-5 h-5 text-amber-500" />
                      <span className="text-sm text-amber-600 font-medium">Convenient</span>
                    </div>
                  </div>
                </button>

                {/* Payment Security Information */}
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-start space-x-3">
                    <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-blue-900">Secure Payment</h4>
                      <p className="text-sm text-blue-700">
                        All digital payments are protected by bank-grade security. 
                        Your payment information is never stored on our servers.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Additional Payment Info */}
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="text-sm font-medium text-gray-900 mb-1">Digital Payments</div>
                    <div className="text-xs text-gray-600">Instant confirmation</div>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="text-sm font-medium text-gray-900 mb-1">Cash on Delivery</div>
                    <div className="text-xs text-gray-600">₹50 handling fee</div>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setStep('details')}
                className="w-full border border-gray-300 text-gray-700 font-medium py-3 rounded-lg hover:bg-gray-50 transition-colors duration-200"
              >
                Back to Details
              </button>
            </div>
          )}

          {/* QR Code Payment Step */}
          {step === 'qr-code' && qrCodeData && (
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Scan QR Code to Pay</h3>
                <p className="text-gray-600 mb-6">Use any UPI app to scan and pay</p>
                
                <div className="bg-white p-6 rounded-lg border-2 border-dashed border-gray-300 mb-6">
                  <img
                    src={qrCodeData.qrCodeUrl}
                    alt="UPI QR Code"
                    className="w-64 h-64 mx-auto mb-4"
                  />
                  <p className="text-sm text-gray-500">Order ID: {qrCodeData.orderId}</p>
                </div>

                <div className="bg-blue-50 rounded-lg p-4 mb-6">
                  <h4 className="font-medium text-blue-900 mb-2">How to pay:</h4>
                  <ol className="text-sm text-blue-800 text-left space-y-1">
                    <li>1. Open any UPI app (PhonePe, Google Pay, Paytm, etc.)</li>
                    <li>2. Scan the QR code above</li>
                    <li>3. Verify the amount: {formatAmount(total)}</li>
                    <li>4. Complete the payment</li>
                  </ol>
                </div>

                <div className="flex space-x-3">
                  <button
                    onClick={() => navigator.clipboard.writeText(`upi://pay?pa=mrugaya@razorpay&pn=Mrugaya Jewelry&am=${total}&cu=INR&tn=Payment for Order ${qrCodeData.orderId}`)}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
                  >
                    <Copy className="w-4 h-4" />
                    <span>Copy UPI Link</span>
                  </button>
                  
                  <button
                    onClick={() => setStep('payment')}
                    className="flex-1 border border-gray-300 text-gray-700 font-medium py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                  >
                    Back
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Processing Step */}
          {step === 'processing' && (
            <div className="text-center py-12">
              <Loader className="w-16 h-16 text-red-600 mx-auto mb-4 animate-spin" />
              <h3 className="text-xl font-medium text-gray-900 mb-2">Processing Payment</h3>
              <p className="text-gray-500">Please wait while we process your payment...</p>
              <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm text-yellow-800">
                  Do not close this window or refresh the page during payment processing.
                </p>
              </div>
            </div>
          )}

          {/* Success Step */}
          {step === 'success' && (
            <div className="text-center py-12">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-900 mb-2">Payment Successful!</h3>
              <p className="text-gray-500 mb-6">
                Your order has been confirmed and will be processed shortly.
              </p>
              
              {paymentResponse && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                  <div className="text-sm text-green-800 space-y-1">
                    <p><strong>Order ID:</strong> {paymentResponse.orderId}</p>
                    <p><strong>Payment ID:</strong> {paymentResponse.paymentId}</p>
                    <p><strong>Amount:</strong> {formatAmount(total)}</p>
                  </div>
                </div>
              )}
              
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-sm text-green-800">
                  Order confirmation has been sent to {customerInfo.email}
                </p>
              </div>
            </div>
          )}

          {/* COD Success Step */}
          {step === 'cod-success' && codOrder && (
            <div className="text-center py-12">
              <CheckCircle className="w-16 h-16 text-amber-500 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-900 mb-2">Order Confirmed!</h3>
              <p className="text-gray-500 mb-6">
                Your Cash on Delivery order has been placed successfully.
              </p>
              
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
                <div className="text-sm text-amber-800 space-y-2">
                  <p><strong>Order ID:</strong> {codOrder.orderId}</p>
                  <p><strong>Product Amount:</strong> {formatAmount(codOrder.amount)}</p>
                  <p><strong>COD Handling Fee:</strong> {formatAmount(codOrder.handlingFee)}</p>
                  <p><strong>Total Amount:</strong> {formatAmount(codOrder.totalAmount)}</p>
                  <p><strong>Estimated Delivery:</strong> {codOrder.estimatedDelivery}</p>
                </div>
              </div>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  You will pay {formatAmount(codOrder.totalAmount)} when your order is delivered.
                  Order confirmation has been sent to {customerInfo.email}
                </p>
              </div>
            </div>
          )}

          {/* Error Step */}
          {step === 'error' && (
            <div className="text-center py-12">
              <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-900 mb-2">Payment Failed</h3>
              <p className="text-gray-500 mb-4">
                {paymentResponse?.message || 'There was an issue processing your payment.'}
              </p>
              
              {paymentResponse?.error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                  <p className="text-sm text-red-800">
                    Error: {paymentResponse.error}
                  </p>
                </div>
              )}
              
              <div className="space-y-3">
                <button
                  onClick={() => setStep('payment')}
                  className="w-full bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-700 hover:to-amber-700 text-white font-bold py-3 rounded-lg transition-all duration-200"
                >
                  Try Again
                </button>
                <button
                  onClick={onClose}
                  className="w-full border border-gray-300 text-gray-700 font-medium py-3 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Payment Verification Modal */}
      {showVerification && verificationData && (
        <PaymentVerification
          paymentId={verificationData.paymentId}
          orderId={verificationData.orderId}
          amount={verificationData.amount}
          onVerificationComplete={handleVerificationComplete}
        />
      )}
    </div>
  );
};

export default PaymentModal;