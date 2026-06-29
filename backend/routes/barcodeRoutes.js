const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const {generateBarcode} = require('../utils/barcodeGenerator');

// Barcode sheet for printing
router.get('/generate', generateBarcode);

module.exports = router;
