import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertProductSchema, 
  insertCategorySchema, 
  insertOrderSchema, 
  insertOrderItemSchema,
  insertUserFavoriteSchema,
  insertCartItemSchema
} from "@shared/schema";
import { z } from "zod";
import Razorpay from "razorpay";
import crypto from "crypto";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Initialize Razorpay instance
  const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
  
  // Products API
  app.get("/api/products", async (req, res) => {
    try {
      const { category, subcategory } = req.query;
      const products = await storage.getProducts(
        category as string, 
        subcategory as string
      );
      res.json({ success: true, products });
    } catch (error) {
      console.error("Error fetching products:", error);
      res.status(500).json({ success: false, message: "Failed to fetch products" });
    }
  });

  app.get("/api/products/featured", async (req, res) => {
    try {
      const products = await storage.getFeaturedProducts();
      res.json({ success: true, products });
    } catch (error) {
      console.error("Error fetching featured products:", error);
      res.status(500).json({ success: false, message: "Failed to fetch featured products" });
    }
  });

  app.get("/api/products/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const product = await storage.getProduct(id);
      if (!product) {
        return res.status(404).json({ success: false, message: "Product not found" });
      }
      res.json({ success: true, product });
    } catch (error) {
      console.error("Error fetching product:", error);
      res.status(500).json({ success: false, message: "Failed to fetch product" });
    }
  });

  // Categories API
  app.get("/api/categories", async (req, res) => {
    try {
      const categories = await storage.getCategories();
      res.json({ success: true, categories });
    } catch (error) {
      console.error("Error fetching categories:", error);
      res.status(500).json({ success: false, message: "Failed to fetch categories" });
    }
  });

  app.get("/api/categories/:id", async (req, res) => {
    try {
      const category = await storage.getCategory(req.params.id);
      if (!category) {
        return res.status(404).json({ success: false, message: "Category not found" });
      }
      res.json({ success: true, category });
    } catch (error) {
      console.error("Error fetching category:", error);
      res.status(500).json({ success: false, message: "Failed to fetch category" });
    }
  });

  // Favorites API
  app.get("/api/favorites", async (req, res) => {
    try {
      const { userId, sessionId } = req.query;
      const favorites = await storage.getUserFavorites(
        userId ? parseInt(userId as string) : null,
        sessionId as string || null
      );
      res.json({ success: true, favorites });
    } catch (error) {
      console.error("Error fetching favorites:", error);
      res.status(500).json({ success: false, message: "Failed to fetch favorites" });
    }
  });

  app.post("/api/favorites", async (req, res) => {
    try {
      const favoriteData = insertUserFavoriteSchema.parse(req.body);
      const favorite = await storage.addFavorite(favoriteData);
      res.json({ success: true, favorite });
    } catch (error) {
      console.error("Error adding favorite:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ success: false, message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ success: false, message: "Failed to add favorite" });
    }
  });

  app.delete("/api/favorites", async (req, res) => {
    try {
      const { userId, sessionId, productId } = req.query;
      await storage.removeFavorite(
        userId ? parseInt(userId as string) : null,
        sessionId as string || null,
        parseInt(productId as string)
      );
      res.json({ success: true, message: "Favorite removed" });
    } catch (error) {
      console.error("Error removing favorite:", error);
      res.status(500).json({ success: false, message: "Failed to remove favorite" });
    }
  });

  // Cart API
  app.get("/api/cart", async (req, res) => {
    try {
      const { userId, sessionId } = req.query;
      const cartItems = await storage.getUserCart(
        userId ? parseInt(userId as string) : null,
        sessionId as string || null
      );
      res.json({ success: true, cartItems });
    } catch (error) {
      console.error("Error fetching cart:", error);
      res.status(500).json({ success: false, message: "Failed to fetch cart" });
    }
  });

  app.post("/api/cart", async (req, res) => {
    try {
      const cartItemData = insertCartItemSchema.parse(req.body);
      const cartItem = await storage.addToCart(cartItemData);
      res.json({ success: true, cartItem });
    } catch (error) {
      console.error("Error adding to cart:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ success: false, message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ success: false, message: "Failed to add to cart" });
    }
  });

  app.put("/api/cart/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { quantity } = req.body;
      const cartItem = await storage.updateCartItem(id, quantity);
      if (!cartItem) {
        return res.status(404).json({ success: false, message: "Cart item not found" });
      }
      res.json({ success: true, cartItem });
    } catch (error) {
      console.error("Error updating cart item:", error);
      res.status(500).json({ success: false, message: "Failed to update cart item" });
    }
  });

  app.delete("/api/cart/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.removeFromCart(id);
      res.json({ success: true, message: "Item removed from cart" });
    } catch (error) {
      console.error("Error removing from cart:", error);
      res.status(500).json({ success: false, message: "Failed to remove from cart" });
    }
  });

  app.delete("/api/cart", async (req, res) => {
    try {
      const { userId, sessionId } = req.query;
      await storage.clearUserCart(
        userId ? parseInt(userId as string) : null,
        sessionId as string || null
      );
      res.json({ success: true, message: "Cart cleared" });
    } catch (error) {
      console.error("Error clearing cart:", error);
      res.status(500).json({ success: false, message: "Failed to clear cart" });
    }
  });

  // Orders API
  app.post("/api/orders", async (req, res) => {
    try {
      const { order, items } = req.body;
      
      // Validate order data
      const orderData = insertOrderSchema.parse(order);
      const orderItemsData = items.map((item: unknown) => insertOrderItemSchema.parse(item));
      
      // Create order and order items
      const createdOrder = await storage.createOrder(orderData);
      const createdOrderItems = await storage.createOrderItems(
        orderItemsData.map((item: any) => ({ ...item, orderId: createdOrder.id }))
      );
      
      res.json({ 
        success: true, 
        order: createdOrder,
        items: createdOrderItems 
      });
    } catch (error) {
      console.error("Error creating order:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ success: false, message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ success: false, message: "Failed to create order" });
    }
  });

  app.get("/api/orders/:orderId", async (req, res) => {
    try {
      const order = await storage.getOrder(req.params.orderId);
      if (!order) {
        return res.status(404).json({ success: false, message: "Order not found" });
      }
      res.json({ success: true, order });
    } catch (error) {
      console.error("Error fetching order:", error);
      res.status(500).json({ success: false, message: "Failed to fetch order" });
    }
  });

  // Payment Integration Routes
  app.post("/api/create-order", async (req, res) => {
    try {
      const { amount, currency, receipt, customerInfo, items } = req.body;
      
      // Create Razorpay order
      const options = {
        amount: Math.round(amount * 100), // Convert to paise and round
        currency: currency || 'INR',
        receipt: receipt || `receipt_${Date.now()}`,
        payment_capture: 1, // Auto-capture payment
      };

      const order = await razorpay.orders.create(options);
      
      res.json({ success: true, order });
    } catch (error) {
      console.error("Error creating payment order:", error);
      res.status(500).json({ success: false, message: "Failed to create payment order" });
    }
  });

  app.post("/api/verify-payment", async (req, res) => {
    try {
      const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
      
      // Verify payment signature
      const body = razorpay_order_id + "|" + razorpay_payment_id;
      const expectedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_SECRET_KEY || '')
        .update(body.toString())
        .digest('hex');

      const isAuthentic = expectedSignature === razorpay_signature;

      if (isAuthentic) {
        // Payment is verified, you can save to database here
        res.json({ 
          success: true, 
          message: "Payment verified successfully",
          verified: true 
        });
      } else {
        res.status(400).json({ 
          success: false, 
          message: "Invalid signature",
          verified: false 
        });
      }
    } catch (error) {
      console.error("Error verifying payment:", error);
      res.status(500).json({ success: false, message: "Payment verification failed" });
    }
  });

  // Payment status check endpoint
  app.get("/api/payment-status/:paymentId", async (req, res) => {
    try {
      const { paymentId } = req.params;
      
      // Fetch payment details from Razorpay
      const payment = await razorpay.payments.fetch(paymentId);
      
      res.json({ 
        success: true, 
        payment: {
          id: payment.id,
          status: payment.status,
          amount: payment.amount,
          currency: payment.currency,
          method: payment.method,
          captured: payment.captured,
        }
      });
    } catch (error) {
      console.error("Error fetching payment status:", error);
      res.status(500).json({ success: false, message: "Failed to fetch payment status" });
    }
  });

  // Cash on Delivery (COD) order endpoint - Ultra simple, no storage required
  app.post("/api/cod-order", async (req, res) => {
    try {
      const { amount, customerInfo, items } = req.body;
      
      if (!customerInfo || !customerInfo.name || !customerInfo.email || !customerInfo.phone) {
        return res.status(400).json({ success: false, message: "Customer information is required" });
      }
      
      // Generate unique order ID
      const orderId = `COD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
      
      // Calculate COD handling fee
      const handlingFee = Math.max(50, Math.round(amount * 0.02));
      const totalAmount = amount + handlingFee;
      
      // Calculate estimated delivery date
      const estimatedDeliveryDate = new Date();
      estimatedDeliveryDate.setDate(estimatedDeliveryDate.getDate() + 8);
      
      console.log(`COD Order Placed - ID: ${orderId}, Customer: ${customerInfo.name}, Total: ₹${totalAmount}`);
      
      // Just log the order details (no storage needed for demo)
      console.log('COD Order Details:', {
        orderId,
        customer: customerInfo.name,
        email: customerInfo.email,
        phone: customerInfo.phone,
        address: customerInfo.address,
        items: items?.length || 0,
        totalAmount: totalAmount
      });
      
      // Prepare response
      const codOrder = {
        orderId,
        amount,
        handlingFee,
        totalAmount,
        estimatedDelivery: estimatedDeliveryDate.toLocaleDateString('en-IN', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        }),
        status: 'confirmed',
      };
      
      res.json({ success: true, order: codOrder });
    } catch (error) {
      console.error("Error processing COD order:", error);
      res.status(500).json({ success: false, message: "Failed to process COD order" });
    }
  });

  // Search API
  app.get("/api/search", async (req, res) => {
    try {
      const { q } = req.query;
      if (!q || typeof q !== 'string') {
        return res.status(400).json({ success: false, message: "Search query is required" });
      }
      
      const products = await storage.searchProducts(q);
      res.json({ success: true, products });
    } catch (error) {
      console.error("Error searching products:", error);
      res.status(500).json({ success: false, message: "Search failed" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
