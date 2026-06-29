const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.get('/', productController.getProducts);
router.get('/barcode/:barcode', productController.getProductByBarcode); //get product information by barcode scan

router.get('/search', productController.searchProducts);
router.get('/low-stock', productController.getLowStockProducts); 

router.get('/:id', productController.getProductById);
router.post('/', productController.addProduct);
router.put('/:id', productController.editProduct); //edit prod details
router.patch('/:id/stock', productController.updateStock);
router.delete('/:id', productController.deleteProduct);

module.exports = router;
