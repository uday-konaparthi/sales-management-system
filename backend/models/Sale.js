const mongoose = require("mongoose");

const SaleSchema = new mongoose.Schema(
  {
    // Owner of the shop
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // User who created this sale
    soldBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    invoiceNumber: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
    },

    products: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },

        barcode: {
          type: String,
          required: true,
          trim: true,
        },

        name: {
          type: String,
          required: true,
          trim: true,
        },

        fabricType: {
          type: String,
          default: null,
        },

        costPrice: {
          type: Number,
          required: true,
          min: 0,
        },

        sellingPrice: {
          type: Number,
          required: true,
          min: 0,
        },

        quantity: {
          type: Number,
          required: true,
          min: 1,
        },

        totalItemPrice: {
          type: Number,
          default: 0,
        },

        profit: {
          type: Number,
          default: 0,
        },
      },
    ],

    totalAmount: {
      type: Number,
      default: 0,
    },

    totalProfit: {
      type: Number,
      default: 0,
    },

    totalItems: {
      type: Number,
      default: 0,
    },

    paymentMethod: {
      type: String,
      enum: ["cash", "upi", "card", "online", "other"],
      default: "cash",
    },

    paymentStatus: {
      type: String,
      enum: [
        "pending",
        "completed",
        "cancelled",
        "refunded",
      ],
      default: "completed",
      index: true,
    },

    customerName: {
      type: String,
      default: null,
      trim: true,
    },

    customerPhone: {
      type: String,
      default: null,
    },

    customerEmail: {
      type: String,
      default: null,
      lowercase: true,
      trim: true,
    },

    discount: {
      type: Number,
      default: 0,
    },

    discountType: {
      type: String,
      enum: ["fixed", "percentage"],
      default: "fixed",
    },

    tax: {
      type: Number,
      default: 0,
    },

    notes: {
      type: String,
      trim: true,
    },

    soldAt: {
      type: Date,
      default: Date.now,
      index: true,
    },

    refundedAt: {
      type: Date,
      default: null,
    },

    refundReason: {
      type: String,
      default: null,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

/* ===========================
   Indexes
=========================== */

SaleSchema.index({
  ownerId: 1,
  soldAt: -1,
});

SaleSchema.index({
  ownerId: 1,
  paymentStatus: 1,
});

SaleSchema.index({
  ownerId: 1,
  invoiceNumber: 1,
});

SaleSchema.index({
  soldBy: 1,
  soldAt: -1,
});

/* ===========================
   Virtual
=========================== */

SaleSchema.virtual("netAmount").get(function () {
  let amount = this.totalAmount;

  if (this.discount > 0) {
    if (this.discountType === "percentage") {
      amount -= amount * this.discount / 100;
    } else {
      amount -= this.discount;
    }
  }

  if (this.tax > 0) {
    amount += amount * this.tax / 100;
  }

  return Number(amount.toFixed(2));
});

/* ===========================
   Middleware
=========================== */

SaleSchema.pre("save", function (next) {

  if (this.isModified("products")) {

    this.totalAmount = 0;
    this.totalProfit = 0;
    this.totalItems = 0;

    this.products.forEach(item => {

      item.totalItemPrice =
        item.sellingPrice * item.quantity;

      item.profit =
        (item.sellingPrice - item.costPrice) *
        item.quantity;

      this.totalAmount += item.totalItemPrice;
      this.totalProfit += item.profit;
      this.totalItems += item.quantity;

    });

  }

  if (this.isNew && !this.invoiceNumber) {

    const now = new Date();

    const invoice =
      "INV-" +
      now.getFullYear() +
      String(now.getMonth() + 1).padStart(2, "0") +
      String(now.getDate()).padStart(2, "0") +
      "-" +
      Math.floor(1000 + Math.random() * 9000);

    this.invoiceNumber = invoice;

  }

  next();

});

module.exports = mongoose.model("Sale", SaleSchema);