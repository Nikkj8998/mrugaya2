import { PaymentDetails, PhonePeResponse } from '../types/cart';

// PhonePe API Configuration
const PHONEPE_CONFIG = {
  merchantId: process.env.VITE_PHONEPE_MERCHANT_ID || 'M1234567890',
  saltKey: process.env.VITE_PHONEPE_SALT_KEY || 'your-salt-key',
  saltIndex: process.env.VITE_PHONEPE_SALT_INDEX || '1',
  apiEndpoint: process.env.VITE_PHONEPE_API_ENDPOINT || 'https://api-preprod.phonepe.com/apis/pg-sandbox',
  redirectUrl: `${window.location.origin}/payment-success`,
  callbackUrl: `${window.location.origin}/api/payment-callback`,
};

/**
 * Generate PhonePe payment request
 */
export const initiatePhonePePayment = async (paymentDetails: PaymentDetails): Promise<PhonePeResponse> => {
  try {
    const { amount, orderId, customerInfo } = paymentDetails;

    // Create payment payload
    const paymentPayload = {
      merchantId: PHONEPE_CONFIG.merchantId,
      merchantTransactionId: orderId,
      merchantUserId: `USER_${Date.now()}`,
      amount: amount * 100, // Convert to paise
      redirectUrl: PHONEPE_CONFIG.redirectUrl,
      redirectMode: 'POST',
      callbackUrl: PHONEPE_CONFIG.callbackUrl,
      mobileNumber: customerInfo.phone,
      paymentInstrument: {
        type: 'PAY_PAGE'
      }
    };

    // Encode payload to base64
    const base64Payload = btoa(JSON.stringify(paymentPayload));
    
    // Generate checksum (In production, this should be done on the server)
    const checksum = await generateChecksum(base64Payload);

    // Make API call to PhonePe
    const response = await fetch(`${PHONEPE_CONFIG.apiEndpoint}/pg/v1/pay`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-VERIFY': checksum,
      },
      body: JSON.stringify({
        request: base64Payload
      })
    });

    const result = await response.json();

    if (result.success) {
      // Redirect to PhonePe payment page
      window.location.href = result.data.instrumentResponse.redirectInfo.url;
      
      return {
        success: true,
        code: result.code,
        message: result.message,
        data: result.data
      };
    } else {
      throw new Error(result.message || 'Payment initiation failed');
    }

  } catch (error) {
    console.error('PhonePe payment error:', error);
    return {
      success: false,
      code: 'PAYMENT_ERROR',
      message: error instanceof Error ? error.message : 'Payment failed'
    };
  }
};

/**
 * Verify payment status
 */
export const verifyPaymentStatus = async (merchantTransactionId: string): Promise<PhonePeResponse> => {
  try {
    const checksum = await generateChecksum(`/pg/v1/status/${PHONEPE_CONFIG.merchantId}/${merchantTransactionId}`);

    const response = await fetch(
      `${PHONEPE_CONFIG.apiEndpoint}/pg/v1/status/${PHONEPE_CONFIG.merchantId}/${merchantTransactionId}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-VERIFY': checksum,
          'X-MERCHANT-ID': PHONEPE_CONFIG.merchantId,
        }
      }
    );

    const result = await response.json();
    return result;

  } catch (error) {
    console.error('Payment verification error:', error);
    return {
      success: false,
      code: 'VERIFICATION_ERROR',
      message: 'Payment verification failed'
    };
  }
};

/**
 * Generate checksum for PhonePe API
 * Note: In production, this should be done on your backend server for security
 */
const generateChecksum = async (payload: string): Promise<string> => {
  // This is a simplified checksum generation for demo purposes
  // In production, use proper HMAC-SHA256 with your salt key on the backend
  const data = payload + '/pg/v1/pay' + PHONEPE_CONFIG.saltKey;
  
  // For demo purposes, we'll use a simple hash
  // In production, implement proper HMAC-SHA256
  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(data);
  const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  
  return `${hashHex}###${PHONEPE_CONFIG.saltIndex}`;
};

/**
 * Handle payment callback
 */
export const handlePaymentCallback = (callbackData: any): PhonePeResponse => {
  try {
    // Process the callback data from PhonePe
    const { code, merchantId, transactionId, amount, providerReferenceId } = callbackData;

    if (code === 'PAYMENT_SUCCESS') {
      return {
        success: true,
        code: 'PAYMENT_SUCCESS',
        message: 'Payment completed successfully',
        data: {
          merchantId,
          merchantTransactionId: transactionId,
          transactionId: providerReferenceId,
          amount,
          state: 'COMPLETED',
          responseCode: 'SUCCESS',
          paymentInstrument: {
            type: 'UPI',
            utr: providerReferenceId
          }
        }
      };
    } else {
      return {
        success: false,
        code: 'PAYMENT_FAILED',
        message: 'Payment was not successful'
      };
    }

  } catch (error) {
    return {
      success: false,
      code: 'CALLBACK_ERROR',
      message: 'Error processing payment callback'
    };
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