const { body } = require('express-validator');

const offerValidator = [
    body('title')
        .notEmpty().withMessage('Title is required')
        .isString().withMessage('Title must be a string')
        .trim(),
    body('description')
        .notEmpty().withMessage('Description is required')
        .isString().withMessage('Description must be a string')
        .trim(),
    body('localId')
        .notEmpty().withMessage('Local ID is required')
        .isMongoId().withMessage('Local ID must be a valid MongoDB ID'),
    body('date')
        .notEmpty().withMessage('Date is required')
        .isISO8601().withMessage('Date must be a valid ISO 8601 date'),
    body('artistId')
        .optional()
        .isMongoId().withMessage('Artist ID must be a valid MongoDB ID')
];

module.exports = { offerValidator };
