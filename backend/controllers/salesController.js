const Sale = require('../models/Sale');
const Product = require('../models/Product');

exports.recordSale = async (req, res) => {
  try {
    const { products, paymentMethod, customerName, customerPhone, customerEmail } = req.body;

    // 🔹 Compute product totals before validation
    const computedProducts = products.map(p => ({
      ...p,
      totalItemPrice: p.sellingPrice * p.quantity,
      profit: (p.sellingPrice - p.costPrice) * p.quantity,
    }));

    for (const item of computedProducts) {
      const result = await Product.findOneAndUpdate(
        {
          _id: item.productId,
          currentStock: { $gte: item.quantity },
        },
        {
          $inc: { currentStock: -item.quantity },
        },
        { new: true }
      );

      if (!result) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${item.name}`,
        });
      }
    }

    const totalAmount = computedProducts.reduce((sum, p) => sum + p.totalItemPrice, 0);
    const totalProfit = computedProducts.reduce((sum, p) => sum + p.profit, 0);
    const totalItems = computedProducts.reduce((sum, p) => sum + p.quantity, 0);

    const ownerId = req.user._id || req.user.id || req.user.ownerId

    const newSale = new Sale({
      products: computedProducts,
      totalAmount,
      totalProfit,
      totalItems,
      paymentMethod,
      soldBy: req.user?._id || "672a5b5b3c1c3f001fb2abcd",
      customerName,
      customerPhone,
      customerEmail,
      ownerId: ownerId
    });

    await newSale.save();

    res.status(201).json({
      success: true,
      message: "Sale created successfully",
      sale: newSale,
    });

  } catch (error) {
    console.error("Error creating sale:", error);
    res.status(400).json({ success: false, message: error.message });
  }
};


exports.getSales = async (req, res, next) => {
  try {
    const { range } = req.query;

    let startDate;

    const now = new Date();

    if (range === 'weekly') {
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7);
    } else if (range === 'monthly') {
      startDate = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
    } else {
      startDate = new Date(0); // all sales if no filter
    }

    const sales = await Sale.find({ soldAt: { $gte: startDate } }).sort('-soldAt');

    res.json(sales);
  } catch (err) {
    next(err);
  }
};
