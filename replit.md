# Mrugaya Jewelry E-commerce Platform

## Project Overview
A full-stack jewelry e-commerce platform built for traditional Maharashtrian jewelry. The application features a React frontend with Express.js backend, PostgreSQL database, and payment integration.

## Architecture
- **Frontend**: React 18 with TypeScript, Wouter for routing, TailwindCSS + Shadcn UI
- **Backend**: Express.js with TypeScript, Drizzle ORM, PostgreSQL (Neon)
- **Database**: PostgreSQL with comprehensive schema for products, categories, orders, users, favorites, and cart
- **Payment**: Razorpay integration (API keys needed)
- **State Management**: React Context for cart and favorites (client-side), with server persistence

## Recent Changes (Auth0 Integration + WhatsApp Chat - August 19, 2025)
- ✅ **Auth0 Integration**: Successfully integrated Auth0 authentication with Google, Facebook, and contact-based login
- ✅ **Product Card Redesign**: Implemented modern rectangular product cards with dual buttons (Buy Now/Add to Cart)
- ✅ **Authentication Flow**: Added authentication-required flow for cart and purchase actions
- ✅ **Categories Page**: Created comprehensive categories page with circular product images for jewelry collections
- ✅ **WhatsApp Integration**: Replaced generic chat with WhatsApp functionality and welcome message
- ✅ **Navigation Enhancement**: "View All Collections" button now navigates to categories page with clickable category items
- ✅ **Environment Setup**: Auth0 secrets properly configured (VITE_AUTH0_DOMAIN, VITE_AUTH0_CLIENT_ID, VITE_AUTH0_AUDIENCE)

## Database Schema
- **users**: Customer information and authentication
- **categories**: Product categories with hierarchical structure
- **products**: Complete product catalog with specs, images, pricing
- **orders**: Order management with status tracking
- **order_items**: Individual items within orders
- **user_favorites**: User favorite products (supports guest sessions)
- **cart_items**: Persistent shopping cart (supports guest sessions)
- **product_images**: Multiple images per product

## API Endpoints
- `/api/products` - Product catalog
- `/api/categories` - Category management
- `/api/cart` - Shopping cart operations
- `/api/favorites` - User favorites
- `/api/orders` - Order management
- `/api/create-order` - Payment order creation
- `/api/verify-payment` - Payment verification
- `/api/search` - Product search

## Environment Variables Needed
- `DATABASE_URL` - ✅ Configured (Neon PostgreSQL)
- `RAZORPAY_KEY_ID` - ✅ Configured
- `RAZORPAY_SECRET_KEY` - ✅ Configured  
- `VITE_RAZORPAY_KEY_ID` - ✅ Configured

## Technology Stack
- Node.js 20
- React 18 + TypeScript
- Express.js
- Drizzle ORM
- PostgreSQL (Neon)
- TailwindCSS + Shadcn UI
- Wouter (routing)
- Razorpay (payments)

## User Preferences
- Professional, direct communication
- Focus on security and data integrity
- Database-first approach over client-side state
- Comprehensive error handling

## Next Steps for Production
1. Configure payment API keys
2. Implement user authentication
3. Add order tracking and management
4. Set up email notifications
5. Implement inventory management
6. Add product reviews system