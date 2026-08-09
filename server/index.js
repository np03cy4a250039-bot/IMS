const path = require('path');
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { sequelize } = require('./models');
const app = express();

app.use(cors());
app.use(express.json());

// Serve uploaded images
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Mount API routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/suppliers', require('./routes/suppliers'));

// Health
app.get('/api/health', (req, res) => res.json({ ok: true }));

// Error handler
app.use(require('./middleware/errorHandler'));

const PORT = process.env.PORT || 3000;
(async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connected');
    app.listen(PORT, () => console.log(`Server listening on ${PORT}`));
  } catch (err) {
    console.error('DB connection error:', err.message || err);
    process.exit(1);
  }
})();
