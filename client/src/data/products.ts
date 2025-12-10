import { Product, Category } from '../types/product';

export const categories: Category[] = [
  {
    id: 'all-jewellery',
    name: 'All Jewellery',
    description: 'Complete collection of traditional Maharashtrian jewelry',
    image: '/piku_tai2.jpeg',
    subcategories: [
      { id: 'thushi', name: 'Thushi', description: 'Traditional Maharashtrian necklaces', image: '/thushi1.jpg' },
      { id: 'earrings', name: 'Earrings', description: 'Elegant traditional earrings', image: '/e1.jfif' },
      { id: 'nath', name: 'Nath', description: 'Beautiful traditional Nath', image: '/n1.png' },
      { id: 'mangalsutra', name: 'Mangalsutra', description: 'Exquisite traditional rings', image: '/m1.png' },
      { id: 'oxide', name: 'Oxide', description: 'Graceful traditional anklets', image: '/m2.png' },
      { id: 'bang', name: 'bangles', description: 'Traditional Bangles', image: '/b1.webp' }
    ]
  },
  {
    id: 'mangalsutra',
    name: 'Mangalsutra',
    description: 'Sacred marriage jewelry with traditional significance',
    image: '/m1.png',
    subcategories: [
      { id: 'diamond-mangalsutra', name: 'Diamond', description: 'Diamond studded mangalsutras', image: '/m1.png' },
      { id: 'daily-wear', name: 'Daily Wear', description: 'Comfortable everyday mangalsutras', image: '/m2.png' },
      { id: 'gold-polish', name: 'Gold Polish', description: 'Traditional gold polished designs', image: '/m1.png' }
    ]
  },
  {
    id: 'nath',
    name: 'Nath',
    description: 'Traditional Maharashtrian nose jewelry',
    image: '/n1.png',
    subcategories: [
      { id: 'gold-nath', name: 'Gold', description: 'Pure gold nath designs', image: '/n1.png' },
      { id: 'moti-nath', name: 'Moti', description: 'Pearl studded nath', image: '/n2.png' },
     
    ]
  },
  {
    id: 'oxide',
    name: 'Oxide',
    description: 'Oxidized silver jewelry with antique finish',
    image: '/n4.jfif',
    subcategories: [
      
      { id: 'oxide-nath-sub', name: 'Nath', description: 'Oxidized silver nath', image: '/n4.jfif' }
    ]
  }
];

export const products: Product[] = [
  {
    id: 1,
    name: 'Royal Thushi Set',
    price: '₹1',
    originalPrice: '₹52,999',
    image: '/thushi1.jpg',
    modelImage: '/thushi1.jpg',
    category: 'all-jewellery',
    subcategory: 'thushi',
    rating: 4.8,
    reviews: 124,
    description: 'Exquisite traditional Maharashtrian Thushi set crafted with gold and adorned with precious pearls. This masterpiece represents the rich cultural heritage of Maharashtra and is perfect for weddings and special occasions.',
    specifications: {
      material: 'Gold Polish',
      weight: '45 grams',
      dimensions: '18 inches length',
      purity: '100%',
     
    },
    images: [
      '/thushi1.jpg',
      '/thushi1.jpg',
      '/thushi1.jpg'
    ],
    inStock: true,
    featured: true,
    tags: ['traditional', 'wedding', 'gold', 'pearls', 'maharashtrian']
  },
  {
    id: 2,
    name: 'Royal Nath',
    price: '₹1',
    originalPrice: '₹99,999',
    image: '/n1.png',
    modelImage: '/n1.png',
    category: 'all-jewellery',
    subcategory: 'nath',
    rating: 4.9,
    reviews: 89,
    description: 'A regal nath fit for a queen, featuring intricate oxide work and precious gemstones. This piece embodies the grandeur of Maratha royalty.',
    specifications: {
      material: 'Oxide',
      weight: '65 grams',
      dimensions: '20 inches length',
      purity: '100%',
      
    },
    images: [
      '/n1.png',
      '/n2.png',
      '/n1.png'
    ],
    inStock: true,
    featured: true,
    tags: ['premium', 'royal', 'gold', 'gemstones', 'necklace']
  },
  
  
  {
    id: 5,
    name: 'Diamond Mangalsutra',
    price: '₹1',
    originalPrice: '₹145,999',
    image: '/m1.png',
    modelImage: '/m1.png',
    category: 'mangalsutra',
    subcategory: 'diamond-mangalsutra',
    rating: 4.9,
    reviews: 203,
    description: 'Elegant diamond mangalsutra combining traditional significance with modern aesthetics. Perfect for the contemporary bride.',
    specifications: {
      material: 'Ameriacan Diamond',
      weight: '25 grams',
      dimensions: '18 inches length',
      purity: '100%',
      
    },
    images: [
      '/m1.png',
      '/m2.png'
    ],
    inStock: true,
    featured: true,
    tags: ['mangalsutra', 'diamond', 'modern', 'bridal', 'gold']
  },
 
];

export const getProductsByCategory = (categoryId: string, subcategoryId?: string): Product[] => {
  return products.filter(product => {
    if (subcategoryId) {
      return product.category === categoryId && product.subcategory === subcategoryId;
    }
    return product.category === categoryId;
  });
};

export const getProductById = (id: number): Product | undefined => {
  return products.find(product => product.id === id);
};

export const getFeaturedProducts = (): Product[] => {
  return products.filter(product => product.featured);
};