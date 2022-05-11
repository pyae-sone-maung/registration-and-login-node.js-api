const express = require("express");
const router = express.Router();
const {
    userValidation,
    loginValidation,
} = require("../validation/user-validation");
const userController = require("../controller/user-controller");

router.post("/register", userValidation, userController.createNewUser);

router.post("/login", loginValidation, userController.userLogin);

module.exports = router;
