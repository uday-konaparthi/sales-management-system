const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    // Authentication
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ["owner", "staff"],
      default: "staff",
    },

    // Staff belongs to an owner
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
      index: true,
    },

    // ========================
    // Shop Details
    // ========================

    shopName: {
      type: String,
      trim: true,
      required: function () {
        return this.role === "owner";
      },
    },

    ownerName: {
      type: String,
      trim: true,
      required: function () {
        return this.role === "owner";
      },
    },

    phone: {
      type: String,
      trim: true,
    },

    alternatePhone: {
      type: String,
      trim: true,
      default: null,
    },

    gstNumber: {
      type: String,
      trim: true,
      uppercase: true,
      default: null,
    },

    emailBusiness: {
      type: String,
      trim: true,
      lowercase: true,
      default: null,
    },

    address: {
      type: String,
      trim: true,
      default: null,
    },

    city: {
      type: String,
      trim: true,
      default: null,
    },

    state: {
      type: String,
      trim: true,
      default: null,
    },

    pincode: {
      type: String,
      trim: true,
      default: null,
    },

    country: {
      type: String,
      default: "India",
    },

    logo: {
      type: String,
      default: null,
    },

    currency: {
      type: String,
      default: "INR",
    },

    gstPercentage: {
      type: Number,
      default: 5,
    },

    invoicePrefix: {
      type: String,
      default: "INV",
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    lastLogin: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
UserSchema.index({ ownerId: 1 });
UserSchema.index({ role: 1 });
UserSchema.index({ shopName: 1 });

module.exports = mongoose.model("User", UserSchema);