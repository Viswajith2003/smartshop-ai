const express = require("express");
const router = express.Router();
const PaymentController = require("../controllers/paymentController");
const { authenticateUser } = require("../middlewares/auth");

router.get("/order/:orderId", authenticateUser, PaymentController.getPaymentDetails);

module.exports = router;
