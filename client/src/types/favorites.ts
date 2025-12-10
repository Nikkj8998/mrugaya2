export interface FavoriteItem {
  id: number;
  name: string;
  price: string;
  originalPrice: string;
  image: string;
  category: string;
  rating: number;
  reviews: number;
  dateAdded: string;
}

export interface FavoritesState {
  items: FavoriteItem[];
  count: number;
  isOpen: boolean;
}