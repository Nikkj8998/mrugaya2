export interface RazorpayOrder {
  id: string;
  entity: string;
  amount: number;
  amount_paid: number;
  amount_due: number;
  currency: string;
  receipt: string;
  status: string;
  attempts: number;
  created_at: number;
}

export interface RazorpayPayment {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

export interface PaymentOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: RazorpayPayment) => void;
  prefill: {
    name: string;
    email: string;
    contact: string;
  };
  notes: {
    address: string;
  };
  theme: {
    color: string;
  };
  method?: {
    upi?: boolean;
    card?: boolean;
    netbanking?: boolean;
    wallet?: boolean;
  };
  modal: {
    ondismiss: () => void;
  };
}

export interface OrderData {
  orderId: string;
  amount: number;
  currency: string;
  customerInfo: {
    name: string;
    email: string;
    phone: string;
    address: string;
  };
  items: Array<{
    id: number;
    name: string;
    price: string;
    quantity: number;
    image: string;
  }>;
  paymentMethod: 'razorpay' | 'cod';
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
  createdAt: string;
}

export interface PaymentResponse {
  success: boolean;
  orderId?: string;
  paymentId?: string;
  signature?: string;
  message: string;
  error?: string;
}

export interface CODOrder {
  orderId: string;
  amount: number;
  handlingFee: number;
  totalAmount: number;
  customerInfo: {
    name: string;
    email: string;
    phone: string;
    address: string;
  };
  items: Array<{
    id: number;
    name: string;
    price: string;
    quantity: number;
  }>;
  status: 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  estimatedDelivery: string;
}

declare global {
  interface Window {
    Razorpay: any;
  }
}