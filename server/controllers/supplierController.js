const { Supplier, Product } = require('../models');

async function list(req, res, next) {
  try {
    const suppliers = await Supplier.findAll({ order: [['name','ASC']] });
    res.json(suppliers);
  } catch (err) { next(err); }
}

async function getById(req, res, next) {
  try {
    const s = await Supplier.findByPk(req.params.id);
    if (!s) return res.status(404).json({ error: 'Supplier not found' });
    res.json(s);
  } catch (err) { next(err); }
}

async function create(req, res, next) {
  try {
    const created = await Supplier.create(req.body);
    res.status(201).json(created);
  } catch (err) {
    if (err.name === 'SequelizeValidationError' || err.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ error: err.errors[0].message });
    }
    next(err);
  }
}

async function update(req, res, next) {
  try {
    const s = await Supplier.findByPk(req.params.id);
    if (!s) return res.status(404).json({ error: 'Supplier not found' });
    await s.update(req.body);
    res.json(s);
  } catch (err) {
    if (err.name === 'SequelizeValidationError' || err.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ error: err.errors[0].message });
    }
    next(err);
  }
}

async function remove(req, res, next) {
  try {
    const s = await Supplier.findByPk(req.params.id);
    if (!s) return res.status(404).json({ error: 'Supplier not found' });
    const count = await Product.count({ where: { supplierId: s.id } });
    if (count > 0) return res.status(400).json({ error: 'Cannot delete supplier with existing products' });
    await s.destroy();
    res.status(204).send();
  } catch (err) { next(err); }
}

module.exports = { list, getById, create, update, remove };
