const express = require('express');
const { recordSale, getSales } = require('../controllers/salesController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', authMiddleware, recordSale);
router.get('/', authMiddleware, getSales);

module.exports = router;
