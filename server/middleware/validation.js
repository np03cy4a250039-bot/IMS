const { body, validationResult } = require('express-validator');

const supplierValidators = [
  body('name').notEmpty().withMessage('Name is required'),
  body('contactEmail').isEmail().withMessage('Valid contactEmail is required')
];

const productValidators = [
  body('name').notEmpty().withMessage('Name is required'),
  body('price').isFloat({ gt: 0 }).withMessage('Price must be a positive number'),
  body('quantity').isInt({ min: 0 }).withMessage('Quantity must be a non-negative integer'),
  body('supplierId').isInt().withMessage('supplierId must be provided')
];

function handleValidation(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: errors.array()[0].msg });
  }
  next();
}

module.exports = { supplierValidators, productValidators, handleValidation };
