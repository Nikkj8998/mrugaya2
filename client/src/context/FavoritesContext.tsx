import React, { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
import { FavoriteItem, FavoritesState } from '../types/favorites';

type FavoritesAction =
  | { type: 'ADD_FAVORITE'; payload: Omit<FavoriteItem, 'dateAdded'> }
  | { type: 'REMOVE_FAVORITE'; payload: number }
  | { type: 'TOGGLE_FAVORITES' }
  | { type: 'CLOSE_FAVORITES' }
  | { type: 'LOAD_FAVORITES'; payload: FavoriteItem[] };

const initialState: FavoritesState = {
  items: [],
  count: 0,
  isOpen: false,
};

const favoritesReducer = (state: FavoritesState, action: FavoritesAction): FavoritesState => {
  switch (action.type) {
    case 'ADD_FAVORITE': {
      const newItem: FavoriteItem = {
        ...action.payload,
        dateAdded: new Date().toISOString(),
      };
      
      const newItems = [...state.items, newItem];
      
      // Save to localStorage
      localStorage.setItem('mrugaya_favorites', JSON.stringify(newItems));
      
      return {
        ...state,
        items: newItems,
        count: newItems.length,
      };
    }

    case 'REMOVE_FAVORITE': {
      const newItems = state.items.filter(item => item.id !== action.payload);
      
      // Save to localStorage
      localStorage.setItem('mrugaya_favorites', JSON.stringify(newItems));
      
      return {
        ...state,
        items: newItems,
        count: newItems.length,
      };
    }

    case 'TOGGLE_FAVORITES':
      return {
        ...state,
        isOpen: !state.isOpen,
      };

    case 'CLOSE_FAVORITES':
      return {
        ...state,
        isOpen: false,
      };

    case 'LOAD_FAVORITES':
      return {
        ...state,
        items: action.payload,
        count: action.payload.length,
      };

    default:
      return state;
  }
};

interface FavoritesContextType {
  state: FavoritesState;
  addFavorite: (item: Omit<FavoriteItem, 'dateAdded'>) => void;
  removeFavorite: (id: number) => void;
  toggleFavorites: () => void;
  closeFavorites: () => void;
  isFavorite: (id: number) => boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const FavoritesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(favoritesReducer, initialState);

  // Load favorites from localStorage on mount
  useEffect(() => {
    const savedFavorites = localStorage.getItem('mrugaya_favorites');
    if (savedFavorites) {
      try {
        const favorites = JSON.parse(savedFavorites);
        dispatch({ type: 'LOAD_FAVORITES', payload: favorites });
      } catch (error) {
        console.error('Error loading favorites from localStorage:', error);
      }
    }
  }, []);

  const addFavorite = (item: Omit<FavoriteItem, 'dateAdded'>) => {
    dispatch({ type: 'ADD_FAVORITE', payload: item });
  };

  const removeFavorite = (id: number) => {
    dispatch({ type: 'REMOVE_FAVORITE', payload: id });
  };

  const toggleFavorites = () => {
    dispatch({ type: 'TOGGLE_FAVORITES' });
  };

  const closeFavorites = () => {
    dispatch({ type: 'CLOSE_FAVORITES' });
  };

  const isFavorite = (id: number) => {
    return state.items.some(item => item.id === id);
  };

  return (
    <FavoritesContext.Provider
      value={{
        state,
        addFavorite,
        removeFavorite,
        toggleFavorites,
        closeFavorites,
        isFavorite,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};