const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const addressSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    phone: { type: String, required: true },
    street: { type: String, required: true },
    city: { type: String, required: true },
    district: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true },
    country: { type: String, default: "India" },
    isDefault: { type: Boolean, default: false },
  },
  { _id: true }
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
      enum: ["active", "blocked", "banned"],
      default: "active",
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
      ref: "User",
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
    lastLogin: Date
  },
  {
    timestamps: true,
  },
);

// Hash password before saving
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Static method to find by email
userSchema.statics.findByEmail = function (email) {
  return this.findOne({ email });
};

// Get public profile method
userSchema.methods.getPublicProfile = function () {
  const userObject = this.toObject();
  delete userObject.password;
  delete userObject.otp;
  delete userObject.otpExpiry;
  delete userObject.resetPwdToken;
  delete userObject.resetPwdExpiry;
  return userObject;
};

module.exports = mongoose.model("User", userSchema);
