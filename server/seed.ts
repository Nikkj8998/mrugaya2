// import { db } from "./db";
import { categories, products } from "@shared/schema";

const categoryData = [
  {
    id: 'all-jewellery',
    name: 'All Jewellery',
    description: 'Complete collection of traditional Maharashtrian jewelry',
    image: 'https://images.pexels.com/photos/1721558/pexels-photo-1721558.jpeg?auto=compress&cs=tinysrgb&w=800',
    parentCategoryId: null,
    isActive: true,
    sortOrder: 0,
  },
  {
    id: 'mangalsutra',
    name: 'Mangalsutra',
    description: 'Sacred marriage jewelry with traditional significance',
    image: 'https://images.pexels.com/photos/1454166/pexels-photo-1454166.jpeg?auto=compress&cs=tinysrgb&w=800',
    parentCategoryId: null,
    isActive: true,
    sortOrder: 1,
  },
  {
    id: 'nath-category',
    name: 'Nath',
    description: 'Traditional Maharashtrian nose jewelry',
    image: '/nath.jfif',
    parentCategoryId: null,
    isActive: true,
    sortOrder: 2,
  },
  {
    id: 'oxide',
    name: 'Oxide',
    description: 'Oxidized silver jewelry with antique finish',
    image: 'https://images.pexels.com/photos/2735981/pexels-photo-2735981.jpeg?auto=compress&cs=tinysrgb&w=800',
    parentCategoryId: null,
    isActive: true,
    sortOrder: 3,
  },
  {
    id: 'bridal',
    name: 'Bridal',
    description: 'Complete bridal jewelry collections',
    image: 'https://images.pexels.com/photos/1454166/pexels-photo-1454166.jpeg?auto=compress&cs=tinysrgb&w=800',
    parentCategoryId: null,
    isActive: true,
    sortOrder: 4,
  },
];

const productData = [
  {
    name: 'Royal Thushi Set',
    description: 'Exquisite traditional Maharashtrian Thushi set crafted with 22K gold and adorned with precious pearls. This masterpiece represents the rich cultural heritage of Maharashtra and is perfect for weddings and special occasions.',
    price: '1',
    originalPrice: '5',
    categoryId: 'all-jewellery',
    subcategoryId: 'thushi',
    material: '22K Gold',
    weight: '45 grams',
    dimensions: '18 inches length',
    purity: '916 Hallmarked',
    inStock: true,
    featured: true,
    rating: '4.8',
    reviewsCount: 124,
    tags: ['traditional', 'wedding', 'gold', 'pearls', 'maharashtrian'],
    images: [
      '/thushi.png',
      'https://images.pexels.com/photos/1454166/pexels-photo-1454166.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1721558/pexels-photo-1721558.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    specifications: {
      material: '22K Gold',
      weight: '45 grams',
      dimensions: '18 inches length',
      purity: '916 Hallmarked',
      gemstones: ['Natural Pearls', 'Ruby']
    }
  },
  {
    name: 'Maharani Necklace',
    description: 'A regal necklace fit for a queen, featuring intricate gold work and precious gemstones. This piece embodies the grandeur of Maratha royalty.',
    price: '89999.00',
    originalPrice: '99999.00',
    categoryId: 'all-jewellery',
    subcategoryId: 'thushi',
    material: '22K Gold',
    weight: '65 grams',
    dimensions: '20 inches length',
    purity: '916 Hallmarked',
    inStock: true,
    featured: true,
    rating: '4.9',
    reviewsCount: 89,
    tags: ['premium', 'royal', 'gold', 'gemstones', 'necklace'],
    images: [
      'https://images.pexels.com/photos/1454166/pexels-photo-1454166.jpeg?auto=compress&cs=tinysrgb&w=400',
      'https://images.pexels.com/photos/1721558/pexels-photo-1721558.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/2735981/pexels-photo-2735981.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    specifications: {
      material: '22K Gold',
      weight: '65 grams',
      dimensions: '20 inches length',
      purity: '916 Hallmarked',
      gemstones: ['Emerald', 'Ruby', 'Diamond']
    }
  },
  {
    name: 'Traditional Nath',
    description: 'Authentic Maharashtrian Nath with delicate gold work and pearl drops.',
    price: '15999.00',
    originalPrice: '18999.00',
    categoryId: 'nath-category',
    subcategoryId: 'gold-nath',
    material: '22K Gold',
    weight: '8 grams',
    dimensions: '3 inches length',
    purity: '916 Hallmarked',
    inStock: true,
    featured: true,
    rating: '4.6',
    reviewsCount: 156,
    tags: ['nath', 'traditional', 'gold', 'pearls', 'bridal'],
    images: [
      '/nath.png',
      'https://images.pexels.com/photos/1454166/pexels-photo-1454166.jpeg?auto=compress&cs=tinysrgb&w=400'
    ],
    specifications: {
      material: '22K Gold',
      weight: '8 grams',
      dimensions: '3 inches length',
      purity: '916 Hallmarked',
      gemstones: ['Natural Pearls']
    }
  },
  {
    name: 'Diamond Mangalsutra',
    description: 'Elegant diamond mangalsutra combining traditional significance with modern aesthetics.',
    price: '125999.00',
    originalPrice: '145999.00',
    categoryId: 'mangalsutra',
    subcategoryId: 'diamond-mangalsutra',
    material: '18K Gold',
    weight: '25 grams',
    dimensions: '16 inches length',
    purity: '750 Hallmarked',
    inStock: true,
    featured: true,
    rating: '4.9',
    reviewsCount: 203,
    tags: ['mangalsutra', 'diamond', 'modern', 'bridal', 'gold'],
    images: [
      'https://images.pexels.com/photos/1454166/pexels-photo-1454166.jpeg?auto=compress&cs=tinysrgb&w=400',
      'https://images.pexels.com/photos/2735981/pexels-photo-2735981.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    specifications: {
      material: '18K Gold',
      weight: '25 grams',
      dimensions: '16 inches length',
      purity: '750 Hallmarked',
      gemstones: ['Diamond']
    }
  }
];

async function seed() {
  try {
    console.log('Seeding categories...');
    
    // Insert categories
    for (const category of categoryData) {
      try {
        await db.insert(categories).values([category]).onConflictDoNothing();
        console.log(`✓ Category "${category.name}" seeded`);
      } catch (error) {
        console.error(`Error seeding category "${category.name}":`, error);
      }
    }

    console.log('Seeding products...');
    
    // Insert products
    for (const product of productData) {
      try {
        await db.insert(products).values([product]);
        console.log(`✓ Product "${product.name}" seeded`);
      } catch (error) {
        console.error(`Error seeding product "${product.name}":`, error);
      }
    }

    console.log('✅ Database seeded successfully!');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

// Run seed if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seed().then(() => process.exit(0));
}

export { seed };