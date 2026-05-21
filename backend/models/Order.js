const mongoose = require("mongoose");
const addressSchema = require("./Address");

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          default: 1,
        },
        price: {
          type: Number,
          required: true,
        },
        itemStatus: {
          type: String,
          enum: ["Active", "Cancelled", "Returned", "Cancel Requested", "Return Requested"],
          default: "Active",
        },
        cancelReason: { type: String },
        returnReason: { type: String }
      },
    ],
    shippingAddress: addressSchema,
    payment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Payment",
    },
    paymentStatus: {
      type: String,
      enum: ["Pending", "Completed", "Failed", "Refunded"],
      default: "Pending",
    },
    pricing: {
      subtotal: { type: Number, required: true, default: 0 },
      shippingPrice: { type: Number, required: true, default: 0 },
      taxPrice: { type: Number, required: true, default: 0 },
      discount: { type: Number, required: true, default: 0 },
      totalPrice: { type: Number, required: true, default: 0 },
      couponCode: { type: String },
    },
    orderStatus: {
      type: String,
      enum: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled", "Returned", "Cancel Requested", "Return Requested"],
      default: "Pending",
    },
    deliveredAt: { type: Date },
    cancelReason: { type: String },
    returnReason: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
