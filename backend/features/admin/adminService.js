const Admin = require("../../models/Admin");
const User = require("../../models/User");
const Product = require("../../models/Product");
const Category = require("../../models/Category");
const Order = require("../../models/Order");
const { generateAdminToken } = require("../../utils/jwt");
const { AuthenticationError, NotFoundError } = require("../../utils/errors");

class AdminService {
  static async login(credentials) {
    const { email, password } = credentials;

    const admin = await Admin.findOne({ email });
    if (!admin) throw new AuthenticationError("Invalid login credentials for admin");

    const isPasswordValid = await admin.comparePassword(password);
    if (!isPasswordValid) throw new AuthenticationError("Invalid login credentials for admin");

    admin.lastLogin = new Date();
    await admin.save();

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
    const [totalUsers, totalProducts, totalCategories, totalOrders] = await Promise.all([
      User.countDocuments({ role: "user" }),
      Product.countDocuments(),
      Category.countDocuments(),
      Order.countDocuments()
    ]);

    const revenueData = await Order.aggregate([
      { $match: { orderStatus: { $nin: ["Cancelled", "Returned"] } } },
      { $group: { _id: null, total: { $sum: "$pricing.totalPrice" } } }
    ]);

    const refundData = await Order.aggregate([
      { $match: { paymentStatus: "Refunded" } },
      { $group: { _id: null, total: { $sum: "$pricing.totalPrice" } } }
    ]);

    return {
      totalUsers,
      totalProducts,
      totalCategories,
      totalOrders,
      totalSales: revenueData[0]?.total || 0,
      totalRefunds: refundData[0]?.total || 0
    };
  }

  static async getAllUsers() {
    return await User.find({ role: "user" })
      .select("-password")
      .sort({ createdAt: -1 });
  }

  static async getAllOrders() {
    return await Order.find()
      .populate("user", "name email")
      .populate("items.product", "name price")
      .sort({ createdAt: -1 });
  }

  static async updateOrderStatus(orderId, status) {
    const order = await Order.findById(orderId);
    if (!order) throw new NotFoundError("Order not found");

    order.orderStatus = status;
    if (status === "Delivered") {
      await this._handleDeliveredOrder(order);
    }

    await order.save();
    return order;
  }

  // Private helper (Rule 1)
  static async _handleDeliveredOrder(order) {
    order.deliveredAt = Date.now();
    await order.populate("payment");
    if (order.payment && order.payment.method === "COD") {
      order.paymentStatus = "Completed";
      order.paidAt = Date.now();
      
      order.payment.status = "Completed";
      order.payment.paidAt = Date.now();
      await order.payment.save();
    }
  }
}

module.exports = AdminService;
