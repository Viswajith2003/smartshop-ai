const mongoose = require("mongoose");
const Admin = require("./models/Admin");
require("dotenv").config();

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected for seeding...");

    const existingAdmin = await Admin.findOne({ email: "admin@smartshop.com" });
    if (existingAdmin) {
      console.log("Admin already exists. Skipping seed.");
      process.exit(0);
    }

    const admin = new Admin({
      name: "Super Admin",
      email: "admin@smartshop.com",
      password: "admin123", // Hardcoded for initial setup
    });

    await admin.save();
    console.log("Admin account seeded successfully!");
    console.log("Email: admin@smartshop.com");
    console.log("Password: admin123");
    process.exit(0);
  } catch (error) {
    console.error("Seeding failed:", error);
    process.exit(1);
  }
};

seedAdmin();
