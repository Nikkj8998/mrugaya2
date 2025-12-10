import React from 'react';
import { Router, Route, Switch } from 'wouter';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { FavoritesProvider } from './context/FavoritesContext';
import Header from './components/Header';
import Hero from './components/Hero';
import BestsellerCollections from './components/BestsellerCollections';
import CulturalHighlights from './components/CulturalHighlights';
import Footer from './components/Footer';
import FloatingChat from './components/FloatingChat';
import CartDrawer from './components/CartDrawer';
import FavoritesDrawer from './components/FavoritesDrawer';
import CategoryPage from './components/CategoryPage';
import CategoriesPage from './components/CategoriesPage';
import LoginPage from './components/LoginPage';
import { CashOnDeliveryPage } from './components/CashOnDeliveryPage';
import { OrderSuccess } from './components/OrderSuccess';
import '@fontsource/playfair-display/400.css';
import '@fontsource/playfair-display/700.css';
import '@fontsource/poppins/400.css';
import '@fontsource/poppins/500.css';
import '@fontsource/poppins/600.css';
import '@fontsource/poppins/700.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <FavoritesProvider>
          <CartProvider>
            <div className="min-h-screen font-sans">
              <Header />
              <Switch>
                <Route path="/" component={() => (
                  <main>
                    <Hero />
                    <BestsellerCollections />
                    <CulturalHighlights />
                  </main>
                )} />
                <Route path="/login" component={LoginPage} />
                <Route path="/categories" component={CategoriesPage} />
                <Route path="/category/:categoryId" component={CategoryPage} />
                <Route path="/category/:categoryId/:subcategoryId" component={CategoryPage} />
                <Route path="/cash-on-delivery" component={CashOnDeliveryPage} />
                <Route path="/order-success" component={OrderSuccess} />
              </Switch>
              <Footer />
              <FloatingChat />
              <CartDrawer />
              <FavoritesDrawer />
            </div>
          </CartProvider>
        </FavoritesProvider>
      </Router>
    </AuthProvider>
  );
}

export default App;