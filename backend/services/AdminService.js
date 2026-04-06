const Admin = require("../models/Admin");
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
    // This will be implemented as we add more models (Users, Products, etc.)
    return {
      totalUsers: 300,
      totalProducts: 150,
      totalSales: 200,
      refunds: 50
    };
  }
}

module.exports = AdminService;
