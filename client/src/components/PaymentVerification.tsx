import React, { useState, useEffect } from 'react';
import { CheckCircle, AlertCircle, Loader, RefreshCw } from 'lucide-react';
import { checkPaymentStatus, formatAmount } from '../services/razorpayService';

interface PaymentVerificationProps {
  paymentId: string;
  orderId: string;
  amount: number;
  onVerificationComplete: (success: boolean, data?: any) => void;
}

const PaymentVerification: React.FC<PaymentVerificationProps> = ({
  paymentId,
  orderId,
  amount,
  onVerificationComplete,
}) => {
  const [status, setStatus] = useState<'checking' | 'success' | 'failed' | 'pending'>('checking');
  const [paymentData, setPaymentData] = useState<any>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const maxRetries = 5;
  const retryInterval = 3000; // 3 seconds

  useEffect(() => {
    verifyPayment();
  }, [paymentId]);

  const verifyPayment = async () => {
    try {
      setStatus('checking');
      setError(null);

      const result = await checkPaymentStatus(paymentId);
      
      if (result.success && result.payment) {
        const payment = result.payment;
        setPaymentData(payment);

        switch (payment.status) {
          case 'captured':
          case 'authorized':
            setStatus('success');
            onVerificationComplete(true, payment);
            break;
          case 'failed':
            setStatus('failed');
            setError('Payment failed');
            onVerificationComplete(false, payment);
            break;
          case 'created':
          default:
            if (retryCount < maxRetries) {
              setStatus('pending');
              setTimeout(() => {
                setRetryCount(prev => prev + 1);
                verifyPayment();
              }, retryInterval);
            } else {
              setStatus('failed');
              setError('Payment verification timeout');
              onVerificationComplete(false, null);
            }
            break;
        }
      } else {
        throw new Error(result.message || 'Failed to verify payment');
      }
    } catch (error) {
      console.error('Payment verification error:', error);
      setError(error instanceof Error ? error.message : 'Verification failed');
      
      if (retryCount < maxRetries) {
        setTimeout(() => {
          setRetryCount(prev => prev + 1);
          verifyPayment();
        }, retryInterval);
      } else {
        setStatus('failed');
        onVerificationComplete(false, null);
      }
    }
  };

  const handleRetry = () => {
    setRetryCount(0);
    verifyPayment();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-[80] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
        <div className="text-center">
          {status === 'checking' && (
            <>
              <Loader className="w-16 h-16 text-blue-600 mx-auto mb-4 animate-spin" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">Verifying Payment</h3>
              <p className="text-gray-600 mb-4">
                Please wait while we confirm your payment...
              </p>
              <div className="bg-blue-50 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  Attempt {retryCount + 1} of {maxRetries + 1}
                </p>
                <div className="w-full bg-blue-200 rounded-full h-2 mt-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${((retryCount + 1) / (maxRetries + 1)) * 100}%` }}
                  />
                </div>
              </div>
            </>
          )}

          {status === 'pending' && (
            <>
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <RefreshCw className="w-8 h-8 text-yellow-600 animate-spin" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Payment Pending</h3>
              <p className="text-gray-600 mb-4">
                Your payment is being processed. We'll check again in a moment...
              </p>
              <div className="bg-yellow-50 rounded-lg p-4">
                <p className="text-sm text-yellow-800">
                  Checking payment status... ({retryCount + 1}/{maxRetries + 1})
                </p>
              </div>
            </>
          )}

          {status === 'success' && (
            <>
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">Payment Verified!</h3>
              <p className="text-gray-600 mb-4">
                Your payment has been successfully processed.
              </p>
              {paymentData && (
                <div className="bg-green-50 rounded-lg p-4 mb-4">
                  <div className="text-sm text-green-800 space-y-1">
                    <p><strong>Payment ID:</strong> {paymentData.id}</p>
                    <p><strong>Amount:</strong> {formatAmount(paymentData.amount / 100)}</p>
                    <p><strong>Method:</strong> {paymentData.method?.toUpperCase()}</p>
                    <p><strong>Status:</strong> {paymentData.status?.toUpperCase()}</p>
                  </div>
                </div>
              )}
            </>
          )}

          {status === 'failed' && (
            <>
              <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">Verification Failed</h3>
              <p className="text-gray-600 mb-4">
                {error || 'We could not verify your payment. Please try again.'}
              </p>
              <div className="bg-red-50 rounded-lg p-4 mb-4">
                <p className="text-sm text-red-800">
                  If you believe this is an error, please contact our support team with your payment details.
                </p>
              </div>
              <button
                onClick={handleRetry}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-lg transition-colors duration-200 mb-2"
              >
                Retry Verification
              </button>
              <button
                onClick={() => onVerificationComplete(false, null)}
                className="w-full border border-gray-300 text-gray-700 font-medium py-3 rounded-lg hover:bg-gray-50 transition-colors duration-200"
              >
                Cancel
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentVerification;