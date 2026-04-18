const express = require("express");
const router = express.Router();

const controller = require("../controllers/shelterController");
const petController = require("../controllers/petController");
const authenticateWithJwt = require("../middleware/authenticateWithJwt");
const isAdmin = require("../middleware/isAdmin");
const validateMongoId = require("../middleware/validateMongoId");
const validatePaginateQueryParams = require("../middleware/validatePaginateQueryParams");

// GET all shelters, POST create shelter
router.route("/")
    .get(validatePaginateQueryParams, controller.list)
    .post(authenticateWithJwt, isAdmin, controller.create);

// GET, PUT, DELETE shelter by ID
router.route("/:id")
    .all(validateMongoId('id'))
    .get(controller.detail)
    .put(authenticateWithJwt, isAdmin, controller.update)
    .delete(authenticateWithJwt, isAdmin, controller.delete);

// Nested: GET pets by shelter
router.route("/:shelterId/pets")
    .all(validateMongoId('shelterId'))
    .get(petController.listByShelter);

module.exports = router;
