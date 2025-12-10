export interface CartItem {
  id: number;
  name: string;
  price: string;
  originalPrice: string;
  image: string;
  category: string;
  quantity: number;
  rating: number;
  reviews: number;
}

export interface CartState {
  items: CartItem[];
  total: number;
  itemCount: number;
  isOpen: boolean;
}

export interface PaymentDetails {
  amount: number;
  currency: string;
  orderId: string;
  customerInfo: {
    name: string;
    email: string;
    phone: string;
    address: string;
  };
}

export interface PhonePeResponse {
  success: boolean;
  code: string;
  message: string;
  data?: {
    merchantId: string;
    merchantTransactionId: string;
    transactionId: string;
    amount: number;
    state: string;
    responseCode: string;
    paymentInstrument: {
      type: string;
      utr?: string;
    };
  };
}