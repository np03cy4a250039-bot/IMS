const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const { supplierValidators, handleValidation } = require('../middleware/validation');
const ctrl = require('../controllers/supplierController');

router.get('/', ctrl.list);
router.get('/:id', ctrl.getById);
router.post('/', authMiddleware, supplierValidators, handleValidation, ctrl.create);
router.put('/:id', authMiddleware, supplierValidators, handleValidation, ctrl.update);
router.delete('/:id', authMiddleware, ctrl.remove);

module.exports = router;
