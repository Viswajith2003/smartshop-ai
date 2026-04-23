const Admin = require("../models/Admin");
const User = require("../models/User");
const Product = require("../models/Product");
const Category = require("../models/Category");
const { generateAdminToken } = require("../utils/jwt");
const { AuthenticationError, NotFoundError } = require("../utils/errors");

class AdminService {
  static async login(credentials) {
    const { email, password } = credentials;

    const admin = await Admin.findOne({ email });
    if (!admin) {
      throw new AuthenticationError("Invalid login credentials for admin");
    }

    const isPasswordValid = await admin.comparePassword(password);
    if (!isPasswordValid) {
      throw new AuthenticationError("Invalid login credentials for admin");
    }

    // Update last login
    admin.lastLogin = new Date();
    await admin.save();

    // Generate Admin JWT (uses ADMIN_SECRET)
    const token = generateAdminToken({
      id: admin._id,
      email: admin.email,
      role: admin.role,
    });

    return {
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
      token,
    };
  }

  static async getDashboardStats() {
    const [totalUsers, totalProducts, totalCategories] = await Promise.all([
      User.countDocuments({ role: 'user' }),
      Product.countDocuments(),
      Category.countDocuments()
    ]);

    return {
      totalUsers,
      totalProducts,
      totalCategories,
      totalSales: 0, // Placeholder for now
      refunds: 0     // Placeholder for now
    };
  }
}

module.exports = AdminService;
