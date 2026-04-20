require("dotenv").config();
const mongoose = require("mongoose");
const Category = require("./models/Category");
const Product = require("./models/Product");
const dbConnection = require("./config/dbAdv");

const sampleCategories = [
  { name: "Electronics", description: "Gadgets and electronic devices", isActive: true },
  { name: "Clothing", description: "Apparel and fashion accessories", isActive: true },
  { name: "Home & Garden", description: "Home appliances and garden tools", isActive: true },
];

const seedData = async () => {
  try {
    await dbConnection.connect();
    
    // Keep existing categories, clear only products to avoid duplicate products on multiple runs
    await Product.deleteMany();
    console.log("Cleared existing products");

    // Ensure categories exist without duplicating. If it exists in your DB, it uses it! If not, creates it.
    console.log("Syncing categories...");
    const electronicsId = (await Category.findOneAndUpdate({ name: "Electronics" }, { description: "Gadgets and electronic devices", isActive: true }, { upsert: true, new: true }))._id;
    const clothingId = (await Category.findOneAndUpdate({ name: "Clothing" }, { description: "Apparel and fashion accessories", isActive: true }, { upsert: true, new: true }))._id;
    const homeId = (await Category.findOneAndUpdate({ name: "Home & Garden" }, { description: "Home appliances and garden tools", isActive: true }, { upsert: true, new: true }))._id;

    // Insert Products with standard Cloudinary demo image URLs
    const sampleProducts = [
      {
        name: "Wireless Headphones X1",
        description: "High-quality noise-canceling wireless headphones perfect for travel.",
        price: 199.99,
        category: electronicsId,
        stock: 50,
        images: ["https://res.cloudinary.com/demo/image/upload/v1615560867/ecommerce/headphones.jpg"],
        isActive: true
      },
      {
        name: "Smartphone Pro Max",
        description: "Latest generation smartphone with advanced camera system.",
        price: 999.00,
        category: electronicsId,
        stock: 25,
        images: ["https://res.cloudinary.com/demo/image/upload/v1615560867/ecommerce/smartphone.jpg"],
        isActive: true
      },
      {
        name: "Classic Cotton T-Shirt",
        description: "Comfortable and breathable 100% cotton t-shirt for everyday wear.",
        price: 19.99,
        category: clothingId,
        stock: 200,
        images: ["https://res.cloudinary.com/demo/image/upload/v1321456/tshirt_front_d8x9tijp.jpg"], // random example url
        isActive: true
      },
      {
        name: "Smart Coffee Maker",
        description: "Wi-Fi enabled coffee maker that you can control from your phone.",
        price: 149.50,
        category: homeId,
        stock: 15,
        images: ["https://res.cloudinary.com/demo/image/upload/coffee_maker.jpg"],
        isActive: true
      }
    ];

    await Product.insertMany(sampleProducts);
    console.log("Products seeded with Cloudinary URLs!");

    await dbConnection.disconnect();
    console.log("Seeding complete. Disconnected from DB.");
    process.exit(0);

  } catch (error) {
    if (error.code === 11000) {
      console.log("It looks like the initial data already exists (Duplicate Key Error).");
    } else {
      console.error("Error during seeding:", error);
    }
    process.exit(1);
  }
};

seedData();
