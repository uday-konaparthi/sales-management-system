const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser')

dotenv.config();

const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const salesRoutes = require('./routes/salesRoutes');
const barcodeRoutes = require('./routes/barcodeRoutes');
const { errorHandler } = require('./middleware/errorMiddleware');
const { dbConnection } = require('./config/db');

const app = express();

const corsOptions = {
  origin: ['https://sales-management-system-backend-q6he.onrender.com'],
  optionsSuccessStatus: 200, 
  credentials: true 
};

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(cookieParser());

// Connect to MongoDB
dbConnection();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/sales', salesRoutes);
app.use('/api/barcode', barcodeRoutes);

app.get('/', (req, res) => {
  res.send("API Running Successfully")
});

// Error handling middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
