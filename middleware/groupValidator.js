const { body } = require('express-validator');

const groupValidator = [
    body('name')
        .notEmpty().withMessage('Name is required')
        .isString().withMessage('Name must be a string')
        .trim(),
    body('members')
        .optional()
        .isArray().withMessage('Members must be an array of Artist IDs'),
    body('members.*')
        .isMongoId().withMessage('Each Member ID must be a valid MongoDB ID')
];

module.exports = { groupValidator };
