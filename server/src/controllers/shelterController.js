const asyncHandler = require("express-async-handler");
const { body, query, validationResult } = require("express-validator");
const Shelter = require("../models/shelter");
const Pet = require("../models/pet");
const generatePaginationLinks = require("../utils/generatePaginationLinks");

const shelterValidator = () => {
    return [
        body('name')
            .notEmpty().withMessage('Name is required')
            .isString().withMessage('Name must be a string'),
        body('address')
            .notEmpty().withMessage('Address is required')
            .isString().withMessage('Address must be a string'),
        body('phone')
            .notEmpty().withMessage('Phone is required')
            .isString().withMessage('Phone must be a string'),
        body('email')
            .notEmpty().withMessage('Email is required')
            .isEmail().withMessage('Email must be a valid email address'),
        body('description')
            .optional()
            .isString().withMessage('Description must be a string'),
    ];
};

// GET all shelters
exports.list = [
    query('search').optional().trim(),
    query('sort').optional().isIn(['name', '-name', 'address', '-address']).withMessage('Invalid sort field'),
    asyncHandler(async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const search = req.query.search || '';
        const filter = search
            ? { name: new RegExp(search, 'i') }
            : {};

        const sortField = req.query.sort || 'name';
        const sortOrder = sortField.startsWith('-') ? -1 : 1;
        const sortKey = sortField.replace(/^-/, '');

        const page = await Shelter.paginate(filter, {
            page: req.paginate.page,
            limit: req.paginate.limit,
            sort: { [sortKey]: sortOrder },
        });

        res.status(200)
            .links(generatePaginationLinks(req.originalUrl, req.paginate.page, page.totalPages, req.paginate.limit))
            .json(page.docs);
    }),
];

// GET shelter by ID
exports.detail = asyncHandler(async (req, res) => {
    const [shelter, shelterPets] = await Promise.all([
        Shelter.findById(req.params.id).exec(),
        Pet.find({ shelter: req.params.id }).exec(),
    ]);

    if (shelter === null) {
        return res.status(404).json({ error: "Shelter not found" });
    }

    res.json({
        shelter: shelter,
        pets: shelterPets,
    });
});

// POST create shelter
exports.create = [
    shelterValidator(),
    asyncHandler(async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const shelter = new Shelter({
            name: req.body.name,
            address: req.body.address,
            phone: req.body.phone,
            email: req.body.email,
            description: req.body.description,
        });

        await shelter.save();
        res.status(201).json(shelter);
    }),
];

// PUT update shelter
exports.update = [
    shelterValidator(),
    asyncHandler(async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const shelter = await Shelter.findOne({ _id: req.params.id });
        if (shelter == null) {
            return res.status(404).json({ error: "Shelter not found" });
        }

        const updatedShelter = await Shelter.findOneAndUpdate(
            { _id: req.params.id },
            {
                $set: {
                    name: req.body.name,
                    address: req.body.address,
                    phone: req.body.phone,
                    email: req.body.email,
                    description: req.body.description,
                }
            },
            { new: true, runValidators: true }
        );

        res.status(200).json(updatedShelter);
    }),
];

// DELETE shelter
exports.delete = asyncHandler(async (req, res) => {
    const [shelter, shelterPets] = await Promise.all([
        Shelter.findById(req.params.id).exec(),
        Pet.find({ shelter: req.params.id }).exec(),
    ]);

    if (shelter == null) {
        return res.status(404).json({ error: "Shelter not found" });
    }

    if (shelterPets.length > 0) {
        return res.status(405).json({
            error: "Cannot delete shelter with remaining pets",
            shelter: shelter,
            pets: shelterPets,
        });
    }

    await Shelter.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Shelter deleted successfully" });
});
