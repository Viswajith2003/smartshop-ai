const express = require("express");
const router = express.Router();
const OrderController = require("./orderController");
const { protect } = require("../../middlewares/auth");
const validate = require("../../middlewares/validate");
const { orderCreateSchema, paymentVerifySchema, cancelReturnSchema, cancelReturnItemSchema } = require("./orderValidation");

router.use(protect);

router.post("/create", validate(orderCreateSchema), OrderController.createOrder);
router.post("/send-wallet-otp", OrderController.sendWalletOTP);
router.post("/verify", validate(paymentVerifySchema), OrderController.verifyPayment);
router.get("/my-orders", OrderController.getMyOrders);
router.post("/:id/cancel", validate(cancelReturnSchema), OrderController.cancelOrder);
router.post("/:id/item/cancel", validate(cancelReturnItemSchema), OrderController.cancelOrderItem);
router.post("/:id/return", validate(cancelReturnSchema), OrderController.returnOrder);
router.post("/:id/item/return", validate(cancelReturnItemSchema), OrderController.returnOrderItem);
router.get("/:id", OrderController.getOrderById);

module.exports = router;
