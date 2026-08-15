const pool = require('../db');

exports.getAllSuppliers = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM suppliers ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (error) {
    console.error('Get suppliers error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getSupplierById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM suppliers WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Supplier not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Get supplier error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.createSupplier = async (req, res) => {
  try {
    const { name, email, phone } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Supplier name is required' });
    }

    const result = await pool.query(
      'INSERT INTO suppliers (name, email, phone) VALUES ($1, $2, $3) RETURNING *',
      [name, email || null, phone || null]
    );

    res.status(201).json({ message: 'Supplier created successfully', supplier: result.rows[0] });
  } catch (error) {
    console.error('Create supplier error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.updateSupplier = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone } = req.body;

    const existingSupplier = await pool.query('SELECT * FROM suppliers WHERE id = $1', [id]);
    if (existingSupplier.rows.length === 0) {
      return res.status(404).json({ error: 'Supplier not found' });
    }

    const result = await pool.query(
      `UPDATE suppliers 
       SET name = COALESCE($1, name), 
           email = COALESCE($2, email), 
           phone = COALESCE($3, phone),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $4 
       RETURNING *`,
      [name || null, email || null, phone || null, id]
    );

    res.json({ message: 'Supplier updated successfully', supplier: result.rows[0] });
  } catch (error) {
    console.error('Update supplier error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.deleteSupplier = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM suppliers WHERE id = $1 RETURNING id', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Supplier not found' });
    }

    res.json({ message: 'Supplier deleted successfully' });
  } catch (error) {
    console.error('Delete supplier error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};
