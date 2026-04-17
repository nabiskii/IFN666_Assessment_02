const { query, validationResult } = require("express-validator");

const validatePaginateQueryParams = [
    query('page')
        .optional()
        .isInt({ min: 1 }).withMessage('Page must be a positive integer')
        .toInt(),
    query('limit')
        .optional()
        .isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100')
        .toInt(),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        req.paginate = {
            page: req.query.page || 1,
            limit: req.query.limit || 10,
        };
        next();
    }
];

module.exports = validatePaginateQueryParams;
