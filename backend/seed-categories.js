require('dotenv').config();
const mongoose = require('mongoose');
const Category = require('./models/Category');
const dbConnection = require('./config/dbAdv');

const categories = [
  {
    name: 'Electronics',
    description: 'Gadgets, devices, and accessories',
    isActive: true,
  },
  {
    name: 'Clothing',
    description: 'Men, women, and kids apparel',
    isActive: true,
  },
  {
    name: 'Home & Kitchen',
    description: 'Furniture, decor, and appliances',
    isActive: true,
  },
  {
    name: 'Books',
    description: 'Fiction, non-fiction, and educational books',
    isActive: true,
  },
  {
    name: 'Sports & Outdoors',
    description: 'Sporting goods and outdoor gear',
    isActive: true,
  }
];

const seedCategories = async () => {
  try {
    await dbConnection.connect();
    
    // Clear existing categories
    await Category.deleteMany({});
    console.log('Cleared existing categories.');
    
    // Drop old index if it exists (caused by previous schema iteration)
    try {
      await Category.collection.dropIndex('categoryName_1');
      console.log('Dropped legacy index: categoryName_1');
    } catch (err) {
      // Ignore if index doesn't exist
    }

    // Sync schema indexes (ensures `name_1` exists)
    await Category.syncIndexes();

    // Insert new categories
    await Category.insertMany(categories);
    console.log('Successfully seeded categories!');
    
  } catch (error) {
    console.error('Error seeding categories:', error);
  } finally {
    process.exit(0);
  }
};

seedCategories();
