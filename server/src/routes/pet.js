const express = require("express");
const router = express.Router();

const controller = require("../controllers/petController");
const applicationController = require("../controllers/applicationController");
const validateMongoId = require("../middleware/validateMongoId");

// GET all pets, POST create pet
router.route("/")
    .get(controller.list)
    .post(controller.create);

// GET, PUT, DELETE pet by ID
router.route("/:id")
    .all(validateMongoId('id'))
    .get(controller.detail)
    .put(controller.update)
    .delete(controller.delete);

// Nested: GET applications by pet
router.route("/:petId/applications")
    .all(validateMongoId('petId'))
    .get(applicationController.listByPet);

module.exports = router;
