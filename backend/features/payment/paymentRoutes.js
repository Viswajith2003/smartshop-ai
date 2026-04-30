const express = require("express");
const router = express.Router();
const PaymentController = require("./paymentController");
const { protect } = require("../../middlewares/auth");

router.use(protect);

router.get("/order/:orderId", PaymentController.getPaymentDetails);

module.exports = router;
