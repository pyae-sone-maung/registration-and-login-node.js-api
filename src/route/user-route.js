const express = require("express");
const router = express.Router();
const { userValidation } = require("../validation/user-validation");
const userController = require("../controller/user-controller");

router.post("/register", userValidation, userController.createNewUser);

module.exports = router;
