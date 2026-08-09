const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const upload = require('../middleware/upload');
const { productValidators, handleValidation } = require('../middleware/validation');
const ctrl = require('../controllers/productController');

router.get('/', ctrl.list);
router.get('/:id', ctrl.getById);
router.post('/', authMiddleware, upload.single('image'), productValidators, handleValidation, ctrl.create);
router.put('/:id', authMiddleware, upload.single('image'), productValidators, handleValidation, ctrl.update);
router.delete('/:id', authMiddleware, ctrl.remove);

module.exports = router;
