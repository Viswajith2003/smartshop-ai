const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: [2, "Product name must be at least 2 characters long"],
      maxlength: [100, "Product name cannot exceed 100 characters"],
    },
    rating:{
      type: Number,
      required: true,
      default: 0,
      min: [0, "Rating must be a positive number"],
      max: [5, "Rating cannot exceed 5"],
    },
    description: {
      type: String,
      required: true,
      trim: true,
      minlength: [10, "Description must be at least 10 characters long"],
    },
    price: {
      type: Number,
      required: true,
      min: [0, "Price must be a positive number"],
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    stock: {
      type: Number,
      required: true,
      min: [0, "Stock cannot be negative"],
      default: 0,
    },
    images: [
      {
        type: String,
        required: true,
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);