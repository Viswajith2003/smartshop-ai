const express = require("express");
const router = express.Router();
const AdminController = require("./adminController");
const categoryRoutes = require("../category/categoryRoutes");
const productRoutes = require("../product/productRoutes");
const { authenticateAdmin } = require("../../middlewares/auth");
const validate = require("../../middlewares/validate");
const { adminLoginSchema, updateOrderStatusSchema } = require("./adminValidation");

// Public route
router.post("/login", validate(adminLoginSchema), AdminController.login);

// Protected routes
router.use(authenticateAdmin);

router.get("/dashboard", AdminController.getDashboardStats);
router.get("/users", AdminController.getAllUsers);

// Nested Feature Management
router.use("/categories", categoryRoutes);
router.use("/products", productRoutes);

// Order Management
router.get("/orders", AdminController.getAllOrders);
router.put("/orders/:id/status", validate(updateOrderStatusSchema), AdminController.updateOrderStatus);

module.exports = router;
