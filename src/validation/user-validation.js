const { check } = require("express-validator");

const userValidation = [
    check("name").not().isEmpty().trim().withMessage("Name is required."),
    check("email").not().isEmpty().trim().withMessage("Email is required."),
    check("date_of_birth")
        .not()
        .isEmpty()
        .isDate()
        .trim()
        .withMessage("Date of birth is required."),
    check("gender").not().isEmpty().trim().withMessage("Gender is required."),
    check("phone").not().isEmpty().trim().withMessage("Phone is required."),
    check("address").not().isEmpty().trim().withMessage("Address is required"),
    check("password")
        .not()
        .isEmpty()
        .isLength({ min: 8 })
        .trim()
        .withMessage("Password must have at least 8 character."),
];

const loginValidation = [
    check("email").not().isEmpty().trim().withMessage("Email is required."),
    check("password")
        .not()
        .isEmpty()
        .isLength({ min: 8 })
        .trim()
        .withMessage("Password must have at least 8 character."),
];

const accountVerifyValidation = [
    check("email").not().isEmpty().trim().withMessage("Email is required."),
    check("confirm_otp")
        .not()
        .isEmpty()
        .trim()
        .withMessage("OTP code is required."),
];

const resetPasswordValidation = [
    check("email").not().isEmpty().trim().withMessage("Email is required."),
    check("new_password")
        .not()
        .isEmpty()
        .isLength({ min: 8 })
        .trim()
        .withMessage("Password must have at least 8 character."),
    check("confirm_otp")
        .not()
        .isEmpty()
        .trim()
        .withMessage("OTP code is required."),
];

module.exports = {
    userValidation,
    loginValidation,
    accountVerifyValidation,
    resetPasswordValidation,
};
