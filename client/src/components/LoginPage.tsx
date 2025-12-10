import React, { useEffect } from 'react';
import { useAuthContext } from '../context/AuthContext';
import { useLocation } from 'wouter';
import { Sparkles, ArrowLeft, Shield, Users, Zap } from 'lucide-react';

const LoginPage: React.FC = () => {
  const { isAuthenticated, isLoading, login } = useAuthContext();
  const [, setLocation] = useLocation();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      // Check if there's a redirect path stored
      const redirectPath = sessionStorage.getItem('authRedirectPath');
      if (redirectPath) {
        sessionStorage.removeItem('authRedirectPath');
        setLocation(redirectPath);
      } else {
        setLocation('/');
      }
    }
  }, [isAuthenticated, setLocation]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-amber-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-amber-50 to-orange-50">
      {/* Header */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <button
          onClick={() => setLocation('/')}
          className="flex items-center text-gray-600 hover:text-red-600 transition-colors duration-200 mb-8"
          data-testid="button-back-home"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Shopping
        </button>
      </div>

      <div className="flex min-h-screen">
        {/* Left Side - Branding */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-red-600 to-amber-600 relative overflow-hidden">
          <div className="absolute inset-0 bg-black bg-opacity-20"></div>
          <div className="relative z-10 flex flex-col justify-center px-12 text-white">
            <div className="mb-8">
              <Sparkles className="w-16 h-16 text-amber-300 mb-6" />
              <h1 className="text-5xl font-serif font-bold mb-4">
                मृगया
                <span className="block text-3xl font-light text-amber-200">Mrugaya Jewelry</span>
              </h1>
              <p className="text-xl text-amber-100 leading-relaxed">
                Where tradition meets elegance. Discover authentic Maharashtrian jewelry crafted with love and heritage.
              </p>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center">
                <Shield className="w-6 h-6 text-amber-300 mr-3" />
                <span className="text-amber-100">Secure & Trusted Platform</span>
              </div>
              <div className="flex items-center">
                <Users className="w-6 h-6 text-amber-300 mr-3" />
                <span className="text-amber-100">Join 10,000+ Happy Customers</span>
              </div>
              <div className="flex items-center">
                <Zap className="w-6 h-6 text-amber-300 mr-3" />
                <span className="text-amber-100">Quick & Easy Checkout</span>
              </div>
            </div>
          </div>
          
          {/* Decorative Pattern */}
          <div className="absolute top-0 right-0 w-64 h-64 opacity-10">
            <svg viewBox="0 0 200 200" className="w-full h-full">
              <defs>
                <pattern id="jewelry-pattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                  <circle cx="20" cy="20" r="2" fill="currentColor" />
                  <circle cx="20" cy="0" r="1" fill="currentColor" />
                  <circle cx="0" cy="20" r="1" fill="currentColor" />
                  <circle cx="40" cy="20" r="1" fill="currentColor" />
                  <circle cx="20" cy="40" r="1" fill="currentColor" />
                </pattern>
              </defs>
              <rect width="200" height="200" fill="url(#jewelry-pattern)" />
            </svg>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center px-4 sm:px-6 lg:px-8">
          <div className="max-w-md w-full space-y-8">
            {/* Mobile Logo */}
            <div className="lg:hidden text-center mb-8">
              <Sparkles className="w-12 h-12 text-red-600 mx-auto mb-4" />
              <h2 className="text-3xl font-serif font-bold text-gray-900">Mrugaya Jewelry</h2>
              <p className="text-gray-600 mt-2">Traditional Maharashtrian Jewelry</p>
            </div>

            <div className="bg-white rounded-2xl shadow-2xl p-8">
              <div className="text-center">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  Welcome Back!
                </h2>
                <p className="text-gray-600 mb-8">
                  Sign in to access your jewelry collection and enjoy a personalized shopping experience.
                </p>
              </div>

              {/* Login Options */}
              <div className="space-y-4">
                <button
                  onClick={login}
                  className="w-full flex items-center justify-center px-4 py-3 border-2 border-red-600 rounded-lg text-red-600 hover:bg-red-600 hover:text-white transition-all duration-200 font-semibold"
                  data-testid="button-login-auth0"
                >
                  <Shield className="w-5 h-5 mr-3" />
                  Continue with Auth0
                </button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">Secure login options</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  <button
                    onClick={() => login()}
                    className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200 font-medium"
                    data-testid="button-login-google"
                  >
                    <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    Continue with Google
                  </button>

                  <button
                    onClick={() => login()}
                    className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200 font-medium"
                    data-testid="button-login-facebook"
                  >
                    <svg className="w-5 h-5 mr-3" fill="#1877F2" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                    Continue with Facebook
                  </button>

                  <button
                    onClick={() => login()}
                    className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200 font-medium"
                    data-testid="button-login-phone"
                  >
                    <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    Continue with Phone
                  </button>
                </div>
              </div>

              <div className="mt-8 text-center">
                <p className="text-sm text-gray-500">
                  By continuing, you agree to our{' '}
                  <a href="#" className="text-red-600 hover:text-red-700 font-medium">
                    Terms of Service
                  </a>{' '}
                  and{' '}
                  <a href="#" className="text-red-600 hover:text-red-700 font-medium">
                    Privacy Policy
                  </a>
                </p>
              </div>
            </div>

            {/* Benefits */}
            <div className="mt-8 bg-white/80 backdrop-blur-sm rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
                Why create an account?
              </h3>
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-red-600 rounded-full mr-3"></div>
                  Track your orders and delivery status
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-red-600 rounded-full mr-3"></div>
                  Save your favorite jewelry pieces
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-red-600 rounded-full mr-3"></div>
                  Get exclusive offers and early access
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-red-600 rounded-full mr-3"></div>
                  Faster checkout experience
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;