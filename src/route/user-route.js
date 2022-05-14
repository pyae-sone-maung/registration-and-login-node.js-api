const express = require("express");
const router = express.Router();
const {
    userValidation,
    loginValidation,
    accountVerifyValidation,
    resetPasswordValidation,
} = require("../validation/user-validation");
const userController = require("../controller/user-controller");

router.post("/register", userValidation, userController.createNewUser);

router.post("/login", loginValidation, userController.userLogin);

router.post("/verify", accountVerifyValidation, userController.accountVerify);

router.post("/resend-verify", userController.resendConfirmOTP);

router.post("/forgot-password", userController.forgotPassword);

router.patch(
    "/reset-password",
    resetPasswordValidation,
    userController.resetPassword
);

module.exports = router;
