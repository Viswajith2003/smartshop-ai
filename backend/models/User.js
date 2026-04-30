const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const addressSchema = require("./Address");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 chars long"],
      maxlength: [50, "Name cannot exceed 50 chars"],
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
      minlength: [8, "Password must be at least 8 chars long"],
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
    blockReason: { type: String, default: null },
    BlockAt: { type: Date, default: null },
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

    // Address list — schema defined in models/Address.js
    address: [addressSchema],

    // Wallet — balance only; transactions are in the Transaction collection
    wallet: {
      balance: {
        type: Number,
        default: 0,
      },
      transactions: [
        {
          amount: Number,
          type: { type: String, enum: ["credit", "debit"] },
          status: { type: String, enum: ["success", "pending", "failed"], default: "success" },
          description: String,
          orderId: mongoose.Schema.Types.ObjectId,
          createdAt: { type: Date, default: Date.now }
        }
      ]
    },

    lastLogin: Date,
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Find by email
userSchema.statics.findByEmail = function (email) {
  return this.findOne({ email });
};

// Return user object without sensitive fields
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
