export interface Product {
  id: number;
  name: string;
  price: string;
  originalPrice: string;
  image: string;
  modelImage?: string; // Image showing jewelry on model
  category: string;
  subcategory?: string;
  rating: number;
  reviews: number;
  description: string;
  specifications: {
    material: string;
    weight: string;
    dimensions: string;
    purity?: string;
    gemstones?: string[];
  };
  images: string[]; // Multiple product images
  inStock: boolean;
  featured: boolean;
  tags: string[];
}

export interface Category {
  id: string;
  name: string;
  description: string;
  image: string;
  subcategories: Subcategory[];
}

export interface Subcategory {
  id: string;
  name: string;
  description: string;
  image: string;
}

export interface ViewMode {
  product: 'product';
  model: 'model';
}