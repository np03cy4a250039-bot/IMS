const express = require('express');
const authMiddleware = require('../middleware/auth');
const supplierController = require('../controllers/supplierController');

const router = express.Router();

router.get('/', authMiddleware, supplierController.getAllSuppliers);
router.get('/:id', authMiddleware, supplierController.getSupplierById);
router.post('/', authMiddleware, supplierController.createSupplier);
router.put('/:id', authMiddleware, supplierController.updateSupplier);
router.delete('/:id', authMiddleware, supplierController.deleteSupplier);

module.exports = router;
