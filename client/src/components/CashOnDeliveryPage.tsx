import React, { useEffect } from 'react';
import { useLocation } from 'wouter';

export function CashOnDeliveryPage() {
  const [, setLocation] = useLocation();
  
  // This component is no longer needed since COD is handled directly in PaymentModal
  // Redirect to home page
  useEffect(() => {
    setLocation('/');
  }, [setLocation]);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
      <div className="text-center">
        <p className="text-gray-600 dark:text-gray-300">Redirecting to homepage...</p>
      </div>
    </div>
  );
}