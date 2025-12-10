// import { db } from "./db";
import { 
  users, 
  products, 
  categories, 
  orders, 
  orderItems, 
  userFavorites, 
  cartItems,
  type User, 
  type InsertUser,
  type Product,
  type InsertProduct,
  type Category,
  type InsertCategory,
  type Order,
  type InsertOrder,
  type OrderItem,
  type InsertOrderItem,
  type UserFavorite,
  type InsertUserFavorite,
  type CartItem,
  type InsertCartItem
} from "@shared/schema";
import { eq, and, desc, inArray } from "drizzle-orm";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Product operations
  getProducts(categoryId?: string, subcategoryId?: string): Promise<Product[]>;
  getFeaturedProducts(): Promise<Product[]>;
  getProduct(id: number): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  searchProducts(query: string): Promise<Product[]>;
  
  // Category operations
  getCategories(): Promise<Category[]>;
  getCategory(id: string): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;
  
  // Order operations
  createOrder(order: InsertOrder): Promise<Order>;
  createOrderItems(items: InsertOrderItem[]): Promise<OrderItem[]>;
  getOrder(orderId: string): Promise<Order | undefined>;
  getUserOrders(userId: number): Promise<Order[]>;
  
  // Favorites operations
  addFavorite(favorite: InsertUserFavorite): Promise<UserFavorite>;
  removeFavorite(userId: number | null, sessionId: string | null, productId: number): Promise<void>;
  getUserFavorites(userId: number | null, sessionId: string | null): Promise<UserFavorite[]>;
  
  // Cart operations
  addToCart(cartItem: InsertCartItem): Promise<CartItem>;
  updateCartItem(id: number, quantity: number): Promise<CartItem | undefined>;
  removeFromCart(id: number): Promise<void>;
  getUserCart(userId: number | null, sessionId: string | null): Promise<CartItem[]>;
  clearUserCart(userId: number | null, sessionId: string | null): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  
  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return result[0];
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.email, email)).limit(1);
    return result[0];
  }

  async createUser(user: InsertUser): Promise<User> {
    const result = await db.insert(users).values(user).returning();
    return result[0];
  }

  // Product operations
  async getProducts(categoryId?: string, subcategoryId?: string): Promise<Product[]> {
    if (subcategoryId) {
      return await db.select().from(products).where(and(
        eq(products.categoryId, categoryId!),
        eq(products.subcategoryId, subcategoryId)
      )).orderBy(desc(products.featured), desc(products.createdAt));
    } else if (categoryId) {
      return await db.select().from(products).where(eq(products.categoryId, categoryId))
        .orderBy(desc(products.featured), desc(products.createdAt));
    }
    
    return await db.select().from(products).orderBy(desc(products.featured), desc(products.createdAt));
  }

  async getFeaturedProducts(): Promise<Product[]> {
    return await db.select().from(products)
      .where(eq(products.featured, true))
      .orderBy(desc(products.createdAt));
  }

  async getProduct(id: number): Promise<Product | undefined> {
    const result = await db.select().from(products).where(eq(products.id, id)).limit(1);
    return result[0];
  }

  async createProduct(product: InsertProduct): Promise<Product> {
    const result = await db.insert(products).values([product]).returning();
    return result[0];
  }

  async searchProducts(query: string): Promise<Product[]> {
    // Simple text search - in a real app you'd use full-text search
    const searchTerm = `%${query.toLowerCase()}%`;
    return await db.select().from(products)
      .where(
        // Note: This is a simplified search, you might want to use proper full-text search
        eq(products.name, query) // Simplified for now
      );
  }

  // Category operations
  async getCategories(): Promise<Category[]> {
    return await db.select().from(categories)
      .where(eq(categories.isActive, true))
      .orderBy(categories.sortOrder);
  }

  async getCategory(id: string): Promise<Category | undefined> {
    const result = await db.select().from(categories).where(eq(categories.id, id)).limit(1);
    return result[0];
  }

  async createCategory(category: InsertCategory): Promise<Category> {
    const result = await db.insert(categories).values(category).returning();
    return result[0];
  }

  // Order operations
  async createOrder(order: InsertOrder): Promise<Order> {
    const result = await db.insert(orders).values(order).returning();
    return result[0];
  }

  async createOrderItems(items: InsertOrderItem[]): Promise<OrderItem[]> {
    const result = await db.insert(orderItems).values(items).returning();
    return result;
  }

  async getOrder(orderId: string): Promise<Order | undefined> {
    const result = await db.select().from(orders).where(eq(orders.orderId, orderId)).limit(1);
    return result[0];
  }

  async getUserOrders(userId: number): Promise<Order[]> {
    return await db.select().from(orders)
      .where(eq(orders.userId, userId))
      .orderBy(desc(orders.createdAt));
  }

  // Favorites operations
  async addFavorite(favorite: InsertUserFavorite): Promise<UserFavorite> {
    const result = await db.insert(userFavorites).values(favorite).returning();
    return result[0];
  }

  async removeFavorite(userId: number | null, sessionId: string | null, productId: number): Promise<void> {
    let whereCondition;
    
    if (userId) {
      whereCondition = and(
        eq(userFavorites.userId, userId),
        eq(userFavorites.productId, productId)
      );
    } else if (sessionId) {
      whereCondition = and(
        eq(userFavorites.sessionId, sessionId),
        eq(userFavorites.productId, productId)
      );
    } else {
      throw new Error("Either userId or sessionId must be provided");
    }
    
    await db.delete(userFavorites).where(whereCondition);
  }

  async getUserFavorites(userId: number | null, sessionId: string | null): Promise<UserFavorite[]> {
    let whereCondition;
    
    if (userId) {
      whereCondition = eq(userFavorites.userId, userId);
    } else if (sessionId) {
      whereCondition = eq(userFavorites.sessionId, sessionId);
    } else {
      return [];
    }
    
    return await db.select().from(userFavorites)
      .where(whereCondition)
      .orderBy(desc(userFavorites.createdAt));
  }

  // Cart operations
  async addToCart(cartItem: InsertCartItem): Promise<CartItem> {
    const result = await db.insert(cartItems).values(cartItem).returning();
    return result[0];
  }

  async updateCartItem(id: number, quantity: number): Promise<CartItem | undefined> {
    const result = await db.update(cartItems)
      .set({ quantity })
      .where(eq(cartItems.id, id))
      .returning();
    return result[0];
  }

  async removeFromCart(id: number): Promise<void> {
    await db.delete(cartItems).where(eq(cartItems.id, id));
  }

  async getUserCart(userId: number | null, sessionId: string | null): Promise<CartItem[]> {
    let whereCondition;
    
    if (userId) {
      whereCondition = eq(cartItems.userId, userId);
    } else if (sessionId) {
      whereCondition = eq(cartItems.sessionId, sessionId);
    } else {
      return [];
    }
    
    return await db.select().from(cartItems)
      .where(whereCondition)
      .orderBy(desc(cartItems.createdAt));
  }

  async clearUserCart(userId: number | null, sessionId: string | null): Promise<void> {
    let whereCondition;
    
    if (userId) {
      whereCondition = eq(cartItems.userId, userId);
    } else if (sessionId) {
      whereCondition = eq(cartItems.sessionId, sessionId);
    } else {
      return;
    }
    
    await db.delete(cartItems).where(whereCondition);
  }
}

export const storage = new DatabaseStorage();
