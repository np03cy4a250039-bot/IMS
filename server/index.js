require('dotenv').config();
const express = require('express');
const { sequelize } = require('./models');
const app = express();
app.use(express.json());
app.get('/api/health', (req, res) => res.json({ ok: true }));
const PORT = process.env.PORT || 3000;
(async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connected');
    app.listen(PORT, () => console.log(Server listening on ));
  } catch (err) {
    console.error('DB connection error:', err.message || err);
    process.exit(1);
  }
})();
