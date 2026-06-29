const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    // Shop Owner (Tenant)
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
      minlength: [2, "Product name must be at least 2 characters"],
      maxlength: [100, "Product name cannot exceed 100 characters"],
    },

    fabricType: {
      type: String,
      trim: true,
      default: null,
    },

    images: [
      {
        type: String,
        validate: {
          validator: function (v) {
            return !v || /^https?:\/\/.+/.test(v);
          },
          message: "Invalid image URL",
        },
      },
    ],

    barcode: {
      type: String,
      required: [true, "Barcode is required"],
      trim: true,
      index: true,
    },

    costPrice: {
      type: Number,
      required: true,
      min: 0,
    },

    sellPrice: {
      type: Number,
      required: true,
      min: 0,
    },

    currentStock: {
      type: Number,
      default: 0,
      min: 0,
    },

    minStockAlert: {
      type: Number,
      default: 10,
      min: 0,
    },

    soldCount: {
      type: Number,
      default: 0,
      min: 0,
    },

    lastRestockDate: {
      type: Date,
      default: null,
    },

    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },


    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// =======================
// Indexes
// =======================

ProductSchema.index({ ownerId: 1, barcode: 1 });

ProductSchema.index({ ownerId: 1, name: "text" });

ProductSchema.index({
  ownerId: 1,
  currentStock: 1,
  minStockAlert: 1,
});

ProductSchema.index({
  ownerId: 1,
  isActive: 1,
});

// =======================
// Virtuals
// =======================

ProductSchema.virtual("isLowStock").get(function () {
  return this.currentStock <= this.minStockAlert;
});

ProductSchema.virtual("stockStatus").get(function () {
  if (this.currentStock === 0) return "Out of Stock";

  if (this.currentStock <= this.minStockAlert)
    return "Low Stock";

  return "In Stock";
});

// =======================
// Middleware
// =======================

ProductSchema.pre("save", function (next) {
  if (this.isModified("currentStock")) {
    this.lastRestockDate = new Date();
  }

  next();
});

// =======================
// Instance Methods
// =======================

ProductSchema.methods.decreaseStock = async function (quantity) {
  if (quantity <= 0) {
    throw new Error("Quantity must be greater than zero.");
  }

  if (this.currentStock < quantity) {
    throw new Error(
      `Insufficient stock. Available: ${this.currentStock}`
    );
  }

  this.currentStock -= quantity;
  this.soldCount += quantity;

  return await this.save();
};

ProductSchema.methods.increaseStock = async function (quantity) {
  if (quantity <= 0) {
    throw new Error("Quantity must be greater than zero.");
  }

  this.currentStock += quantity;
  this.lastRestockDate = new Date();

  return await this.save();
};

// =======================
// Static Methods
// =======================

ProductSchema.statics.findLowStock = function (ownerId) {
  return this.find({
    ownerId,
    isActive: true,
    $expr: {
      $lte: ["$currentStock", "$minStockAlert"],
    },
  }).sort({
    currentStock: 1,
  });
};

ProductSchema.statics.findByBarcode = function (
  ownerId,
  barcode
) {
  return this.findOne({
    ownerId,
    barcode,
    isActive: true,
  });
};

// =======================
// JSON
// =======================

ProductSchema.set("toJSON", {
  virtuals: true,
});

ProductSchema.set("toObject", {
  virtuals: true,
});

module.exports = mongoose.model("Product", ProductSchema);