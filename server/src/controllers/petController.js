const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const mongoose = require("mongoose");
const Pet = require("../models/pet");
const Shelter = require("../models/shelter");
const Application = require("../models/application");

const petValidator = () => {
    return [
        body('name')
            .notEmpty().withMessage('Name is required')
            .isString().withMessage('Name must be a string'),
        body('species')
            .notEmpty().withMessage('Species is required')
            .isIn(['dog', 'cat', 'bird', 'rabbit', 'other'])
            .withMessage('Species must be dog, cat, bird, rabbit, or other'),
        body('breed')
            .notEmpty().withMessage('Breed is required')
            .isString().withMessage('Breed must be a string'),
        body('age')
            .notEmpty().withMessage('Age is required')
            .isInt({ min: 0 }).withMessage('Age must be a positive integer'),
        body('gender')
            .notEmpty().withMessage('Gender is required')
            .isIn(['male', 'female']).withMessage('Gender must be male or female'),
        body('description')
            .notEmpty().withMessage('Description is required')
            .isString().withMessage('Description must be a string'),
        body('status')
            .optional()
            .isIn(['available', 'pending', 'adopted'])
            .withMessage('Status must be available, pending, or adopted'),
        body('shelter')
            .notEmpty().withMessage('Shelter is required')
            .custom((value) => mongoose.Types.ObjectId.isValid(value))
            .withMessage('Shelter must be a valid MongoDB ObjectId'),
    ];
};

// GET all pets
exports.list = asyncHandler(async (req, res) => {
    const allPets = await Pet.find()
        .populate({ path: "shelter", select: "name" })
        .sort({ name: 1 })
        .exec();
    res.json(allPets);
});

// GET pet by ID
exports.detail = asyncHandler(async (req, res) => {
    const [pet, petApplications] = await Promise.all([
        Pet.findById(req.params.id).populate("shelter").exec(),
        Application.find({ pet: req.params.id })
            .populate({ path: "applicant", select: "username" })
            .exec(),
    ]);

    if (pet === null) {
        return res.status(404).json({ error: "Pet not found" });
    }

    res.json({
        pet: pet,
        applications: petApplications,
    });
});

// POST create pet
exports.create = [
    petValidator(),
    asyncHandler(async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        // Check shelter exists
        const shelterExists = await Shelter.exists({ _id: req.body.shelter });
        if (!shelterExists) {
            return res.status(404).json({ error: "Shelter not found" });
        }

        const pet = new Pet({
            name: req.body.name,
            species: req.body.species,
            breed: req.body.breed,
            age: req.body.age,
            gender: req.body.gender,
            description: req.body.description,
            status: req.body.status || 'available',
            shelter: req.body.shelter,
        });

        await pet.save();
        res.status(201).json(pet);
    }),
];

// PUT update pet
exports.update = [
    petValidator(),
    asyncHandler(async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const pet = await Pet.findOne({ _id: req.params.id });
        if (pet == null) {
            return res.status(404).json({ error: "Pet not found" });
        }

        // Check shelter exists
        const shelterExists = await Shelter.exists({ _id: req.body.shelter });
        if (!shelterExists) {
            return res.status(404).json({ error: "Shelter not found" });
        }

        const updatedPet = await Pet.findOneAndUpdate(
            { _id: req.params.id },
            {
                $set: {
                    name: req.body.name,
                    species: req.body.species,
                    breed: req.body.breed,
                    age: req.body.age,
                    gender: req.body.gender,
                    description: req.body.description,
                    status: req.body.status,
                    shelter: req.body.shelter,
                }
            },
            { new: true, runValidators: true }
        );

        res.status(200).json(updatedPet);
    }),
];

// DELETE pet
exports.delete = asyncHandler(async (req, res) => {
    const [pet, petApplications] = await Promise.all([
        Pet.findById(req.params.id).exec(),
        Application.find({ pet: req.params.id, status: 'pending' }).exec(),
    ]);

    if (pet == null) {
        return res.status(404).json({ error: "Pet not found" });
    }

    if (petApplications.length > 0) {
        return res.status(405).json({
            error: "Cannot delete pet with pending applications",
            pet: pet,
            applications: petApplications,
        });
    }

    await Pet.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Pet deleted successfully" });
});

// GET pets by shelter (nested route)
exports.listByShelter = asyncHandler(async (req, res) => {
    const shelter = await Shelter.findById(req.params.shelterId).exec();
    if (shelter === null) {
        return res.status(404).json({ error: "Shelter not found" });
    }

    const pets = await Pet.find({ shelter: req.params.shelterId })
        .sort({ name: 1 })
        .exec();
    res.json(pets);
});
