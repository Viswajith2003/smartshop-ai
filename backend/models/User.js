const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [2, "Name must be atleast 2 char long"],
      maxlength: [50, "Name cannot exceed 50 char"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please provide a valid email",
      ],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "pwd must be at least 8 char long"],
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    phone: String,
    avatar: String,
    status: {
      type: String,
      enum: ["active", "blocked"],
      default: "user",
    },
    blockReason: {
      type: String,
      default: null,
    },
    BlockAt: {
      type: Date,
      default: null,
    },
    BlockedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      default: null,
    },

    otp: String,
    otpExpiry: Date,
    resetPwdToken: String,
    resetPwdExpiry: Date,

    isVerified: {
      type: Boolean,
      default: false,
    },

    address: [addressSchema],
    wallet: {
      balance: {
        type: Number,
        default: 0,
      },
      transations: [transationSchema],
    },
  },
  {
    timestamps: true,
  },
);

const addressSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    phone: { type: String, required: true },
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true },
    country: { type: String, default: "India" },
    isDefault: { type: Boolean, default: false },
  },
  { _id: false },
);

const transationSchema = new mongoose.Schema(
  {
    amount: Number,
    type: {
      type: String,
      enum: ["credit", "debit"],
    },
    status: {
      type: String,
      enum: ["success", "pending", "failed"],
    },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: false },
);

module.exports = mongoose.model("User", userSchema);
