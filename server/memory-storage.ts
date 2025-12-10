// Simple in-memory storage for orders - no database required
interface SimpleOrder {
  id: string;
  orderId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerAddress: string;
  totalAmount: string;
  paymentMethod: string;
  paymentStatus: string;
  orderStatus: string;
  createdAt: Date;
  items: SimpleOrderItem[];
}

interface SimpleOrderItem {
  productId: number;
  productName: string;
  productImage: string;
  quantity: number;
  unitPrice: string;
  totalPrice: string;
}

class MemoryOrderStorage {
  private orders: Map<string, SimpleOrder> = new Map();
  private orderCounter = 1;

  async createOrder(orderData: any): Promise<SimpleOrder> {
    const orderId = `ORD-${Date.now()}-${this.orderCounter}`;
    this.orderCounter++;

    const order: SimpleOrder = {
      id: orderId,
      orderId: orderData.orderId || orderId,
      customerName: orderData.customerName,
      customerEmail: orderData.customerEmail,
      customerPhone: orderData.customerPhone,
      customerAddress: orderData.customerAddress,
      totalAmount: orderData.totalAmount,
      paymentMethod: orderData.paymentMethod,
      paymentStatus: orderData.paymentStatus,
      orderStatus: orderData.orderStatus,
      createdAt: new Date(),
      items: []
    };

    this.orders.set(orderId, order);
    return order;
  }

  async addOrderItems(orderId: string, items: SimpleOrderItem[]): Promise<void> {
    const order = this.orders.get(orderId);
    if (order) {
      order.items = items;
    }
  }

  async getOrder(orderId: string): Promise<SimpleOrder | undefined> {
    return this.orders.get(orderId);
  }

  async getAllOrders(): Promise<SimpleOrder[]> {
    return Array.from(this.orders.values());
  }
}

export const memoryOrderStorage = new MemoryOrderStorage();
export type { SimpleOrder, SimpleOrderItem };