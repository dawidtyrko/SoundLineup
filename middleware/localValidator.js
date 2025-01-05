const { body } = require('express-validator');

const localValidator = [
    body('name')
        .notEmpty().withMessage('Name is required')
        .isString().withMessage('Name must be a string')
        .trim(),
    body('address')
        .notEmpty().withMessage('Address is required')
        .isString().withMessage('Address must be a string')
        .trim(),
    body('country')
        .notEmpty().withMessage('Country is required')
        .isString().withMessage('Country must be a string')
        .trim()
];

module.exports = { localValidator };
