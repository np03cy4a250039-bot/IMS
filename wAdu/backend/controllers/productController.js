const pool = require('../db');
const path = require('path');

exports.getAllProducts = async (req, res) => {
  try {
    const { search, supplier_id } = req.query;
    let query = `
      SELECT p.*, s.name as supplier_name 
      FROM products p 
      LEFT JOIN suppliers s ON p.supplier_id = s.id 
      WHERE 1=1
    `;
    const params = [];

    if (search) {
      query += ` AND p.name ILIKE $${params.length + 1}`;
      params.push(`%${search}%`);
    }

    if (supplier_id) {
      query += ` AND p.supplier_id = $${params.length + 1}`;
      params.push(supplier_id);
    }

    query += ` ORDER BY p.created_at DESC`;
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      `SELECT p.*, s.name as supplier_name, s.email as supplier_email, s.phone as supplier_phone 
       FROM products p 
       LEFT JOIN suppliers s ON p.supplier_id = s.id 
       WHERE p.id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.createProduct = async (req, res) => {
  try {
    const { name, description, price, quantity, supplier_id } = req.body;

    // Validation
    if (!name || price === undefined || quantity === undefined) {
      return res.status(400).json({ error: 'Name, price, and quantity are required' });
    }

    if (price < 0 || quantity < 0) {
      return res.status(400).json({ error: 'Price and quantity cannot be negative' });
    }

    let image_url = null;
    if (req.file) {
      image_url = `/uploads/${req.file.filename}`;
    }

    const result = await pool.query(
      `INSERT INTO products (name, description, price, quantity, supplier_id, image_url) 
       VALUES ($1, $2, $3, $4, $5, $6) 
       RETURNING *`,
      [name, description || null, price, quantity, supplier_id || null, image_url]
    );

    res.status(201).json({ message: 'Product created successfully', product: result.rows[0] });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, quantity, supplier_id } = req.body;

    // Validation
    if (price !== undefined && price < 0) {
      return res.status(400).json({ error: 'Price cannot be negative' });
    }

    if (quantity !== undefined && quantity < 0) {
      return res.status(400).json({ error: 'Quantity cannot be negative' });
    }

    // Get existing product
    const existingProduct = await pool.query('SELECT * FROM products WHERE id = $1', [id]);
    if (existingProduct.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    let image_url = existingProduct.rows[0].image_url;
    if (req.file) {
      image_url = `/uploads/${req.file.filename}`;
    }

    const result = await pool.query(
      `UPDATE products 
       SET name = COALESCE($1, name), 
           description = COALESCE($2, description), 
           price = COALESCE($3, price), 
           quantity = COALESCE($4, quantity), 
           supplier_id = COALESCE($5, supplier_id),
           image_url = COALESCE($6, image_url),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $7 
       RETURNING *`,
      [name || null, description || null, price || null, quantity || null, supplier_id || null, image_url, id]
    );

    res.json({ message: 'Product updated successfully', product: result.rows[0] });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM products WHERE id = $1 RETURNING id', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};
