const express = require("express");
const router = express.Router();

const controller = require("../controllers/applicationController");
const authenticateWithJwt = require("../middleware/authenticateWithJwt");
const validateMongoId = require("../middleware/validateMongoId");
const validatePaginateQueryParams = require("../middleware/validatePaginateQueryParams");

// GET all applications, POST create application
router.route("/")
    .get(validatePaginateQueryParams, controller.list)
    .post(authenticateWithJwt, controller.create);

// GET, PUT, DELETE application by ID
router.route("/:id")
    .all(validateMongoId('id'))
    .get(controller.detail)
    .put(authenticateWithJwt, controller.update)
    .delete(authenticateWithJwt, controller.delete);

module.exports = router;
