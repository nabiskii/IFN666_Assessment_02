const express = require("express");
const router = express.Router();

const applicationController = require("../controllers/applicationController");
const validateMongoId = require("../middleware/validateMongoId");

// Nested: GET applications by user
router.route("/:userId/applications")
    .all(validateMongoId('userId'))
    .get(applicationController.listByUser);

module.exports = router;
