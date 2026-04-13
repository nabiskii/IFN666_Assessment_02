const express = require("express");
const router = express.Router();

const controller = require("../controllers/shelterController");
const petController = require("../controllers/petController");
const validateMongoId = require("../middleware/validateMongoId");

// GET all shelters, POST create shelter
router.route("/")
    .get(controller.list)
    .post(controller.create);

// GET, PUT, DELETE shelter by ID
router.route("/:id")
    .all(validateMongoId('id'))
    .get(controller.detail)
    .put(controller.update)
    .delete(controller.delete);

// Nested: GET pets by shelter
router.route("/:shelterId/pets")
    .all(validateMongoId('shelterId'))
    .get(petController.listByShelter);

module.exports = router;
