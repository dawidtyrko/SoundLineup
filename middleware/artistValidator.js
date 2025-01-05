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
    // body('rating')
    //     .notEmpty().withMessage('Rating is required')
    //     .isNumeric().withMessage('Number required')
    //     .custom(value => {
    //         if (value < 1 || value > 10) {
    //             throw new Error('Rating must be between 1 and 10');
    //         }
    //         return true;
    //     })
];

module.exports = { artistValidator };
