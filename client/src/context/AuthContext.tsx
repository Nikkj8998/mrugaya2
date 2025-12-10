import React, { createContext, useContext, useEffect, useState } from 'react';
import { Auth0Provider, useAuth0 } from '@auth0/auth0-react';

// Auth0 configuration - these should be environment variables
const AUTH0_DOMAIN = import.meta.env.VITE_AUTH0_DOMAIN || 'dev-bfojozlc11jj6nbe.us.auth0.com';
const AUTH0_CLIENT_ID = import.meta.env.VITE_AUTH0_CLIENT_ID || 'BhUzv1E7UpuChbipIytFqmFTPeStLmGx';
// const AUTH0_AUDIENCE = import.meta.env.VITE_AUTH0_AUDIENCE || 'https://mrugaya-jewelry.us.auth0.com/api/v2/';

interface AuthContextType {
  user: any;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: () => void;
  logout: () => void;
  loginWithRedirect: (options?: any) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};

const AuthContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const {
    user,
    isAuthenticated,
    isLoading,
    loginWithRedirect,
    logout: auth0Logout,
  } = useAuth0();

  const login = () => {
    loginWithRedirect({
      authorizationParams: {
        redirect_uri: window.location.origin,
        screen_hint: 'login',
      },
    });
  };

  const logout = () => {
    auth0Logout({
      logoutParams: {
        returnTo: window.location.origin,
      },
    });
  };

  const value = {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    loginWithRedirect,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <Auth0Provider
      domain={AUTH0_DOMAIN}
      clientId={AUTH0_CLIENT_ID}
      authorizationParams={{
        redirect_uri: window.location.origin,
        // audience: AUTH0_AUDIENCE,
        scope: 'openid profile email',
      }}
      useRefreshTokens={true}
      cacheLocation="localstorage"
    >
      <AuthContextProvider>
        {children}
      </AuthContextProvider>
    </Auth0Provider>
  );
};

export default AuthProvider;