const path = require('path');
const fs = require('fs');
const { Product, Supplier } = require('../models');

async function list(req, res, next) {
  try {
    const where = {};
    const { supplierId, q } = req.query;
    if (supplierId) where.supplierId = supplierId;
    if (q) where.name = { [require('sequelize').Op.iLike]: `%${q}%` };
    const products = await Product.findAll({ where, include: [{ model: Supplier, attributes: ['id','name'] }], order: [['createdAt','DESC']] });
    res.json(products);
  } catch (err) { next(err); }
}

async function getById(req, res, next) {
  try {
    const p = await Product.findByPk(req.params.id, { include: [{ model: Supplier, attributes: ['id','name'] }] });
    if (!p) return res.status(404).json({ error: 'Product not found' });
    res.json(p);
  } catch (err) { next(err); }
}

async function create(req, res, next) {
  try {
    const data = req.body;
    if (req.file) {
      data.imageUrl = `/uploads/${req.file.filename}`;
    }
    const created = await Product.create(data);
    const full = await Product.findByPk(created.id, { include: [{ model: Supplier, attributes: ['id','name'] }] });
    res.status(201).json(full);
  } catch (err) {
    if (err.name === 'SequelizeValidationError' || err.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ error: err.errors[0].message });
    }
    next(err);
  }
}

async function update(req, res, next) {
  try {
    const p = await Product.findByPk(req.params.id);
    if (!p) return res.status(404).json({ error: 'Product not found' });
    const data = req.body;
    if (req.file) {
      // remove old file if exists
      if (p.imageUrl) {
        const old = path.join(__dirname, '..', p.imageUrl.replace(/^\//, ''));
        fs.unlink(old, () => {});
      }
      data.imageUrl = `/uploads/${req.file.filename}`;
    }
    await p.update(data);
    const full = await Product.findByPk(p.id, { include: [{ model: Supplier, attributes: ['id','name'] }] });
    res.json(full);
  } catch (err) {
    if (err.name === 'SequelizeValidationError' || err.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ error: err.errors[0].message });
    }
    next(err);
  }
}

async function remove(req, res, next) {
  try {
    const p = await Product.findByPk(req.params.id);
    if (!p) return res.status(404).json({ error: 'Product not found' });
    await p.destroy();
    res.status(204).send();
  } catch (err) { next(err); }
}

module.exports = { list, getById, create, update, remove };
