const express = require("express");
const router = express.Router();

const controller = require("../controllers/applicationController");
const validateMongoId = require("../middleware/validateMongoId");

// GET all applications, POST create application
router.route("/")
    .get(controller.list)
    .post(controller.create);

// GET, PUT, DELETE application by ID
router.route("/:id")
    .all(validateMongoId('id'))
    .get(controller.detail)
    .put(controller.update)
    .delete(controller.delete);

module.exports = router;
