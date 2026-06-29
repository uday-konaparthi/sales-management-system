const Product = require('../models/Product');
const bwipjs = require('bwip-js');

exports.getProducts = async (req, res, next) => {
  try {
    const ownerId = req.user.id || req.user._id || req.user.ownerId;
    
    console.log("ownerId : ", ownerId)

    const products = await Product.find({
      ownerId,
    }).sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    next(err);
  }
};

exports.addProduct = async (req, res, next) => {
  try {
    const {
      name,
      fabricType,
      costPrice,
      currentStock,
      minStockAlert,
      sellPrice
    } = req.body;

    if (!name || !costPrice || !sellPrice === undefined) {
      return res.status(400).json({
        message: 'Name, category, cost price, and stock are required'
      });
    }

    const barcodeIdentifier = `${costPrice}`;
    const barcodeText = `TXL${barcodeIdentifier}21Z596`.replace(/\s+/g, '');

    const existingProduct = await Product.findOne({ barcode: barcodeText });

    let barcodeImage;

    // ✅ Generate barcode image
    if (!existingProduct) {
      try {
        const png = await bwipjs.toBuffer({
          bcid: 'code128',
          text: barcodeText,
          scale: 3,
          height: 10,
          includetext: true,
          textxalign: 'center',
        });
        barcodeImage = `data:image/png;base64,${png.toString('base64')}`;
      } catch (barcodeErr) {
        console.error('Barcode generation error:', barcodeErr);
        return res.status(500).json({ message: 'Failed to generate barcode' });
      }
    } else {
      barcodeImage = existingProduct.barcodeImage
      barcode = existingProduct.barcodeText
    }

    //console.log(req.user);

    const ownerId = req.user.id || req.user.ownerId

    //console.log("ownerId : ", ownerId)

    const newProduct = new Product({
      name,
      fabricType,
      costPrice,
      sellPrice,
      currentStock,
      minStockAlert: minStockAlert || 10,
      barcode: barcodeText,
      images: [],
      barcodeImage,
      ownerId : ownerId,
      createdBy: req.user.id || req.user._id || ownerId,
    });

    await newProduct.save();

    res.status(201).json({
      message: 'Product added successfully',
      product: newProduct,
      barcodeImage
    });
  } catch (err) {
    next(err);
  }
};

exports.editProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    delete updateData.barcode;

    const product = await Product.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json({
      message: 'Product updated successfully',
      product
    });
  } catch (err) {
    next(err);
  }
};

exports.deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json({
      message: 'Product deleted successfully',
      deletedProduct: product
    });
  } catch (err) {
    next(err);
  }
};

exports.getProductById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(product);
  } catch (err) {
    next(err);
  }
};

exports.getProductByBarcode = async (req, res, next) => {
  try {
    const { barcode } = req.params;
    const products = await Product.find({ barcode });

    if (products.length === 0) {
      return res.status(404).json({ message: 'No products found with this barcode' });
    }

    res.json(products);
  } catch (err) {
    next(err);
  }
};

exports.updateStock = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { quantity, operation } = req.body;

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (operation === 'subtract') {
      if (product.currentStock < quantity) {
        return res.status(400).json({
          message: 'Insufficient stock',
          available: product.currentStock
        });
      }
      product.currentStock -= quantity;
    } else if (operation === 'add') {
      product.currentStock += quantity;
    }

    await product.save();

    res.json({
      message: 'Stock updated successfully',
      product
    });
  } catch (err) {
    next(err);
  }
};

exports.getLowStockProducts = async (req, res, next) => {
  try {
    const products = await Product.find({
      $expr: { $lte: ['$currentStock', '$minStockAlert'] }
    }).sort({ currentStock: 1 });

    res.json(products);
  } catch (err) {
    next(err);
  }
};

exports.searchProducts = async (req, res, next) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({ message: 'Search query required' });
    }

    const products = await Product.find({
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { category: { $regex: query, $options: 'i' } },
        { color: { $regex: query, $options: 'i' } },
        { barcode: { $regex: query, $options: 'i' } }
      ]
    });

    res.json(products);
  } catch (err) {
    next(err);
  }
};
