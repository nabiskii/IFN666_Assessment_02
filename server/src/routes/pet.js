const express = require("express");
const router = express.Router();

const controller = require("../controllers/petController");
const applicationController = require("../controllers/applicationController");
const authenticateWithJwt = require("../middleware/authenticateWithJwt");
const validateMongoId = require("../middleware/validateMongoId");
const validatePaginateQueryParams = require("../middleware/validatePaginateQueryParams");

// GET all pets, POST create pet
router.route("/")
    .get(validatePaginateQueryParams, controller.list)
    .post(authenticateWithJwt, controller.create);

// GET, PUT, DELETE pet by ID
router.route("/:id")
    .all(validateMongoId('id'))
    .get(controller.detail)
    .put(authenticateWithJwt, controller.update)
    .delete(authenticateWithJwt, controller.delete);

// Nested: GET applications by pet
router.route("/:petId/applications")
    .all(validateMongoId('petId'))
    .get(applicationController.listByPet);

module.exports = router;
