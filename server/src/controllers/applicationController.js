const asyncHandler = require("express-async-handler");
const { body, query, validationResult } = require("express-validator");
const mongoose = require("mongoose");
const Application = require("../models/application");
const Pet = require("../models/pet");
const User = require("../models/user");
const generatePaginationLinks = require("../utils/generatePaginationLinks");

const applicationValidator = () => {
    return [
        body('applicant')
            .notEmpty().withMessage('Applicant is required')
            .custom((value) => mongoose.Types.ObjectId.isValid(value))
            .withMessage('Applicant must be a valid MongoDB ObjectId'),
        body('pet')
            .notEmpty().withMessage('Pet is required')
            .custom((value) => mongoose.Types.ObjectId.isValid(value))
            .withMessage('Pet must be a valid MongoDB ObjectId'),
        body('status')
            .optional()
            .isIn(['pending', 'approved', 'rejected'])
            .withMessage('Status must be pending, approved, or rejected'),
        body('message')
            .notEmpty().withMessage('Message is required')
            .isString().withMessage('Message must be a string'),
    ];
};

// GET all applications
exports.list = [
    query('search').optional().trim(),
    query('sort').optional().isIn(['status', '-status', 'message', '-message']).withMessage('Invalid sort field'),
    asyncHandler(async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const search = req.query.search || '';
        const filter = search
            ? { status: new RegExp(search, 'i') }
            : {};

        const sortField = req.query.sort || '-status';
        const sortOrder = sortField.startsWith('-') ? -1 : 1;
        const sortKey = sortField.replace(/^-/, '');

        const page = await Application.paginate(filter, {
            page: req.paginate.page,
            limit: req.paginate.limit,
            sort: { [sortKey]: sortOrder },
            populate: [
                { path: "pet", select: "name species status" },
                { path: "applicant", select: "username" },
            ],
        });

        res.status(200)
            .links(generatePaginationLinks(req.originalUrl, req.paginate.page, page.totalPages, req.paginate.limit))
            .json(page.docs);
    }),
];

// GET application by ID
exports.detail = asyncHandler(async (req, res) => {
    const application = await Application.findById(req.params.id)
        .populate("pet")
        .populate({ path: "applicant", select: "username" })
        .exec();

    if (application === null) {
        return res.status(404).json({ error: "Application not found" });
    }

    res.json(application);
});

// POST create application
exports.create = [
    applicationValidator(),
    asyncHandler(async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        // Check pet exists
        const pet = await Pet.findById(req.body.pet).exec();
        if (!pet) {
            return res.status(404).json({ error: "Pet not found" });
        }

        // Check pet is not already adopted
        if (pet.status === 'adopted') {
            return res.status(400).json({ error: "This pet has already been adopted" });
        }

        // Check applicant exists
        const userExists = await User.exists({ _id: req.body.applicant });
        if (!userExists) {
            return res.status(404).json({ error: "Applicant not found" });
        }

        const application = new Application({
            applicant: req.body.applicant,
            pet: req.body.pet,
            status: req.body.status || 'pending',
            message: req.body.message,
        });

        await application.save();
        res.status(201).json(application);
    }),
];

// PUT update application
exports.update = [
    applicationValidator(),
    asyncHandler(async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const application = await Application.findOne({ _id: req.params.id });
        if (application == null) {
            return res.status(404).json({ error: "Application not found" });
        }

        // If approving, mark pet as adopted and reject other pending applications
        if (req.body.status === 'approved' && application.status !== 'approved') {
            await Pet.findByIdAndUpdate(application.pet, { status: 'adopted' });
            await Application.updateMany(
                { pet: application.pet, _id: { $ne: req.params.id }, status: 'pending' },
                { status: 'rejected' }
            );
        }

        const updatedApplication = await Application.findOneAndUpdate(
            { _id: req.params.id },
            {
                $set: {
                    applicant: req.body.applicant,
                    pet: req.body.pet,
                    status: req.body.status,
                    message: req.body.message,
                }
            },
            { new: true, runValidators: true }
        );

        res.status(200).json(updatedApplication);
    }),
];

// DELETE application
exports.delete = asyncHandler(async (req, res) => {
    const application = await Application.findById(req.params.id).exec();

    if (application == null) {
        return res.status(404).json({ error: "Application not found" });
    }

    await Application.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Application deleted successfully" });
});

// GET applications by user (nested route)
exports.listByUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.userId).exec();
    if (user === null) {
        return res.status(404).json({ error: "User not found" });
    }

    const applications = await Application.find({ applicant: req.params.userId })
        .populate({ path: "pet", select: "name species status" })
        .populate({ path: "applicant", select: "username" })
        .exec();
    res.json(applications);
});

// GET applications by pet (nested route)
exports.listByPet = asyncHandler(async (req, res) => {
    const pet = await Pet.findById(req.params.petId).exec();
    if (pet === null) {
        return res.status(404).json({ error: "Pet not found" });
    }

    const applications = await Application.find({ pet: req.params.petId })
        .populate({ path: "applicant", select: "username" })
        .exec();
    res.json(applications);
});
