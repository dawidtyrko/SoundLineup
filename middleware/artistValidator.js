const { body } = require('express-validator');

const artistValidator = [
    body('name')
        .notEmpty().withMessage('Name is required')
        .isString().withMessage('Name must be a string')
        .trim(),
    body('age')
        .optional()
        .isInt({ min: 0 }).withMessage('Age must be a non-negative integer'),
    body('groupId')
        .optional()
        .isMongoId().withMessage('Group ID must be a valid MongoDB ID')
];

module.exports =  {artistValidator} ;
