const express = require("express");
const AuthRouter = require("./auth");
const ShelterRouter = require("./shelter");
const PetRouter = require("./pet");
const ApplicationRouter = require("./application");

const router = express.Router();

router.use('/auth', AuthRouter);
router.use('/shelters', ShelterRouter);
router.use('/pets', PetRouter);
router.use('/applications', ApplicationRouter);

module.exports = router;
