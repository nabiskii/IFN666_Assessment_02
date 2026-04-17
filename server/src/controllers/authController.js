require("dotenv").config();
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const User = require("../models/user");

const registerValidator = () => {
    return [
        body('username')
            .notEmpty().withMessage('Username is required')
            .isString().withMessage('Username must be a string')
            .isLength({ min: 3, max: 30 }).withMessage('Username must be between 3 and 30 characters')
            .trim(),
        body('password')
            .notEmpty().withMessage('Password is required')
            .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
            .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter')
            .matches(/[a-z]/).withMessage('Password must contain at least one lowercase letter')
            .matches(/[0-9]/).withMessage('Password must contain at least one number')
            .matches(/[^A-Za-z0-9]/).withMessage('Password must contain at least one special character'),
    ];
};

const loginValidator = () => {
    return [
        body('username')
            .notEmpty().withMessage('Username is required')
            .trim(),
        body('password')
            .notEmpty().withMessage('Password is required'),
    ];
};

exports.register = [
    registerValidator(),
    asyncHandler(async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { username, password, is_admin } = req.body;

        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ error: "Username is already taken" });
        }

        const user = new User({ username, password, is_admin });
        await user.save();
        res.status(201).json({ message: "User registered successfully" });
    }),
];

exports.login = [
    loginValidator(),
    asyncHandler(async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { username, password } = req.body;
        const user = await User.findOne({ username });
        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ error: "Invalid credentials" });
        }
        const token = jwt.sign(
            { user_id: user._id, is_admin: user.is_admin },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );
        res.json({ token });
    }),
];
