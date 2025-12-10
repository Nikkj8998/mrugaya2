import { PaymentOptions, RazorpayPayment, PaymentResponse, OrderData, CODOrder } from '../types/payment';
import { CartItem } from '../types/cart';

// Razorpay Configuration
const RAZORPAY_CONFIG = {
  keyId: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_1234567890',
  apiUrl: '/api', // Backend API endpoint
};

/**
 * Load Razorpay script dynamically
 */
export const loadRazorpayScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

/**
 * Generate unique order ID
 */
const generateOrderId = (): string => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substr(2, 9);
  return `MRG_${timestamp}_${random}`;
};

/**
 * Create Razorpay order via backend API
 */
export const createRazorpayOrder = async (
  amount: number,
  customerInfo: any,
  items: CartItem[]
): Promise<any> => {
  try {
    const response = await fetch(`${RAZORPAY_CONFIG.apiUrl}/create-order`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount,
        currency: 'INR',
        receipt: generateOrderId(),
        customerInfo,
        items,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.message || 'Failed to create order');
    }

    return result.order;
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    throw new Error('Failed to create payment order');
  }
};

/**
 * Verify payment via backend API
 */
export const verifyPayment = async (paymentData: RazorpayPayment): Promise<PaymentResponse> => {
  try {
    const response = await fetch(`${RAZORPAY_CONFIG.apiUrl}/verify-payment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(paymentData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Payment verification error:', error);
    return {
      success: false,
      message: 'Payment verification failed',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
};

/**
 * Initialize Razorpay payment for UPI/Digital payments
 */
export const initiateRazorpayPayment = async (
  amount: number,
  customerInfo: any,
  items: CartItem[],
  paymentMethod: 'upi' | 'card' | 'netbanking' | 'wallet' | 'phonepe' | 'googlepay' = 'upi'
): Promise<PaymentResponse> => {
  try {
    // Load Razorpay script
    const isLoaded = await loadRazorpayScript();
    if (!isLoaded) {
      throw new Error('Failed to load Razorpay SDK');
    }

    // Create order via backend
    const order = await createRazorpayOrder(amount, customerInfo, items);

    // Configure payment method preferences
    const methodConfig: any = {};
    
    switch (paymentMethod) {
      case 'phonepe':
        methodConfig.upi = true;
        methodConfig.wallet = ['phonepe'];
        break;
      case 'googlepay':
        methodConfig.upi = true;
        methodConfig.wallet = ['googlepay'];
        break;
      case 'upi':
        methodConfig.upi = true;
        break;
      default:
        methodConfig[paymentMethod] = true;
    }

    return new Promise((resolve) => {
      const options: PaymentOptions = {
        key: RAZORPAY_CONFIG.keyId,
        amount: order.amount,
        currency: order.currency,
        name: 'मृगया - Mrugaya Jewelry',
        description: `Payment for ${items.length} jewelry item(s)`,
        order_id: order.id,
        handler: async (response: RazorpayPayment) => {
          try {
            // Verify payment via backend
            const verificationResult = await verifyPayment(response);
            
            if (verificationResult.success) {
              // Save order to localStorage for order tracking
              const orderData: OrderData = {
                orderId: order.receipt,
                amount,
                currency: order.currency,
                customerInfo,
                items: items.map(item => ({
                  id: item.id,
                  name: item.name,
                  price: item.price,
                  quantity: item.quantity,
                  image: item.image,
                })),
                paymentMethod: 'razorpay',
                status: 'completed',
                createdAt: new Date().toISOString(),
              };

              localStorage.setItem(`order_${order.receipt}`, JSON.stringify(orderData));

              resolve({
                success: true,
                orderId: order.receipt,
                paymentId: response.razorpay_payment_id,
                signature: response.razorpay_signature,
                message: 'Payment completed successfully',
              });
            } else {
              resolve({
                success: false,
                message: verificationResult.message || 'Payment verification failed',
                error: verificationResult.error,
              });
            }
          } catch (error) {
            resolve({
              success: false,
              message: 'Payment processing failed',
              error: error instanceof Error ? error.message : 'Unknown error',
            });
          }
        },
        prefill: {
          name: customerInfo.name,
          email: customerInfo.email,
          contact: customerInfo.phone,
        },
        notes: {
          address: customerInfo.address,
        },
        theme: {
          color: '#DC2626', // Red color matching the website theme
        },
        method: methodConfig,
        modal: {
          ondismiss: () => {
            resolve({
              success: false,
              message: 'Payment cancelled by user',
            });
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    });
  } catch (error) {
    console.error('Razorpay payment error:', error);
    return {
      success: false,
      message: 'Payment initialization failed',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
};

/**
 * Generate UPI QR Code for payments
 */
export const generateUPIQRCode = async (
  amount: number,
  customerInfo: any,
  items: CartItem[]
): Promise<{ qrCodeUrl: string; orderId: string }> => {
  try {
    // Create order first
    const order = await createRazorpayOrder(amount, customerInfo, items);
    const orderId = order.receipt;
    
    // Create UPI payment URL
    const upiUrl = `upi://pay?pa=mrugaya@razorpay&pn=Mrugaya Jewelry&am=${amount}&cu=INR&tn=Payment for Order ${orderId}`;
    
    // Generate QR code URL (using a QR code service)
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(upiUrl)}`;
    
    // Save pending order
    const orderData: OrderData = {
      orderId,
      amount,
      currency: 'INR',
      customerInfo,
      items: items.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image,
      })),
      paymentMethod: 'razorpay',
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    localStorage.setItem(`order_${orderId}`, JSON.stringify(orderData));

    return { qrCodeUrl, orderId };
  } catch (error) {
    console.error('QR Code generation error:', error);
    throw new Error('Failed to generate UPI QR code');
  }
};

/**
 * Process Cash on Delivery order
 */
export const processCODOrder = async (
  amount: number,
  customerInfo: any,
  items: CartItem[]
): Promise<CODOrder> => {
  try {
    const response = await fetch(`${RAZORPAY_CONFIG.apiUrl}/cod-order`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount,
        customerInfo,
        items,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.message || 'Failed to process COD order');
    }

    // Save COD order locally
    const orderData: OrderData = {
      orderId: result.order.orderId,
      amount: result.order.totalAmount,
      currency: 'INR',
      customerInfo,
      items: items.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image,
      })),
      paymentMethod: 'cod',
      status: 'processing',
      createdAt: new Date().toISOString(),
    };

    localStorage.setItem(`order_${result.order.orderId}`, JSON.stringify(orderData));

    return result.order;
  } catch (error) {
    console.error('COD order processing error:', error);
    throw new Error('Failed to process COD order');
  }
};

/**
 * Get order details by ID
 */
export const getOrderDetails = (orderId: string): OrderData | null => {
  try {
    const orderData = localStorage.getItem(`order_${orderId}`);
    return orderData ? JSON.parse(orderData) : null;
  } catch (error) {
    console.error('Error fetching order details:', error);
    return null;
  }
};

/**
 * Format amount for display
 */
export const formatAmount = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
  }).format(amount);
};

/**
 * Check payment status manually (alternative to webhooks)
 */
export const checkPaymentStatus = async (paymentId: string): Promise<any> => {
  try {
    const response = await fetch(`${RAZORPAY_CONFIG.apiUrl}/payment-status/${paymentId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Payment status check error:', error);
    throw error;
  }
};