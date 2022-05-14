const userModel = require("../model/user-model");
const bcrypt = require("bcrypt");
const { validationResult, check } = require("express-validator");
const { verifyNumber } = require("../utils/otp-generator");
const { mailSender } = require("../utils/mail-sender");

// Creating new user
const createNewUser = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
        return res.status(400).json({ message: errors.array() });

    const isEmailExist = await userModel.findOne({ email: req.body.email });
    if (isEmailExist)
        return res
            .status(400)
            .json({ message: "Email address is already exist." });

    bcrypt.hash(req.body.password, 10, (err, hash) => {
        if (err) return res.status(500).json({ message: err.array() });
        try {
            const otp = verifyNumber(6);
            const user = {
                name: req.body.name,
                email: req.body.email,
                date_of_birth: new Date(req.body.date_of_birth), // YY / MM / DD
                gender: req.body.gender,
                phone: req.body.phone,
                address: req.body.address,
                password: hash,
                confirm_otp: otp,
            };

            userModel.insertMany(user, (err, data) => {
                if (err) return res.status(500).json({ message: err });
                const subject = "Account Verification";
                const html =
                    "<p> Dear " +
                    data[0].name +
                    ", </p> </br> </br> <p> Please find below the verification code to complete your registration. </br> </br> <h3> Verification Code: " +
                    data[0].confirm_otp +
                    " </h3> </br> </br> <p> Please feel free to contact us if you have any question.Thank you.</p> </br> <p> Best Regards,</p>";

                mailSender(subject, req.body.email, html, otp);
                return res.status(201).json({
                    message: `A verification code has been sent to ${req.body.email}. Please check your mail.`,
                });
            });
        } catch (error) {
            return res.status(500).json({ message: error });
        }
    });
};

// Account login
const userLogin = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
        return res.status(400).json({ message: errors.array() });

    const { email, password } = req.body;
    try {
        const data = await userModel.findOne({ email: email });
        if (data === null)
            return res.status(404).json({
                message: "Your account has not been founded.",
            });
        if (data.isVerified === false)
            return res.status(401).json({
                message: "Your account has not been verified. Please verify.",
            });

        bcrypt.compare(password, data.password, (err, result) => {
            if (result === false)
                return res
                    .status(401)
                    .json({ message: "email and password are not match." });
            return res.status(200).json({
                meta: { message: "login successfully" },
                data: {
                    id: data._id,
                    name: data.name,
                    email: data.email,
                    date_of_birth: data.date_of_birth,
                    gender: data.gender,
                    phone: data.phone,
                    address: data.address,
                },
            });
        });
    } catch (error) {
        return res.status(500).json({ message: error });
    }
};

// Account verify with OTP
const accountVerify = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
        return res.status(400).json({ message: errors.array() });

    try {
        const { email, confirm_otp } = req.body;
        const data = await userModel.findOne({ email: email });
        if (data === null)
            return res.status(404).json({
                message: `The email address ${email} is not associated with any account.`,
            });
        else if (data.isVerified === true)
            return res.status(200).json({
                message:
                    "Your account has already been verified. Please login.",
            });
        else if (confirm_otp !== data.confirm_otp)
            return res
                .status(400)
                .json({ message: "Your verification code is invalid." });
        userModel.findOneAndUpdate(
            { email: email },
            { $set: { isVerified: true, confirm_otp: null } },
            (err, data) => {
                if (err) return res.status(500).json({ message: err });
                return res.status(200).json({
                    message: "Your account has been verified. Please login.",
                });
            }
        );
    } catch (error) {
        return res.status(500).json({ message: error });
    }
};

// Resend comnfirmation code
const resendConfirmOTP = async (req, res, next) => {
    const email = req.body.email;
    try {
        const data = await userModel.findOne({ email: email });
        if (data === null)
            return res.status(404).json({
                message: `The email address ${email} is not associated with any account.`,
            });
        else if (data.isVerified === true)
            return res
                .status(200)
                .json({ message: "Your account is already verified." });
        const subject = "Account Verification ";
        const html =
            "<p> Dear " +
            `${data.name}` +
            ", </p> </br> </br> <p> Please find below the verification code to complete your registration. </br> </br> <h3> Verification Code: " +
            `${data.confirm_otp}` +
            " </h3> </br> </br> <p> Please feel free to contact us if you have any question.Thank you.</p> </br> <p> Best Regards,</p>";

        mailSender(subject, email, html, data.confirm_otp);
        return res.status(200).json({
            message: `A verification code has been sent to ${req.body.email}. Please check your mail.`,
        });
    } catch (error) {
        return res.status(500).json({ message: error });
    }
};

// Forgot password
const forgotPassword = async (req, res, next) => {
    const email = req.body.email;
    const otp = verifyNumber(6);
    try {
        const data = await userModel.findOne({ email: email });
        if (data === null)
            return res
                .status(404)
                .json({ message: "Your account has not been found." });
        else if (data.isVerified === false)
            return res.status(403).json({
                message: "Your account has not been verified. Please verify.",
            });
        userModel.findOneAndUpdate(
            { email: email },
            { $set: { confirm_otp: otp } },
            (err, result) => {
                if (err) return res.sendStatus(500);
                const subject = "Password Reset";
                const html =
                    "<p> Dear, " +
                    `${data.name}` +
                    ", </p> </br>" +
                    "<p> Forgot your password? </p> </br> " +
                    "<p> We received a request to reset the password for your account. </p> </br > </br >" +
                    "<p> To reset your password, use the following code bellow: </p> </br >" +
                    "<h3> Reset Code: " +
                    `${otp}` +
                    "</h3> </br>" +
                    "<p> Please feel free to contact us if you have any question. Thak you. </p> </br >" +
                    "<p> Best Regards, </p>";
                mailSender(subject, email, html, otp);
                return res.status(200).json({
                    message: `Password reset code has been sent to ${email}. Please check your mail.`,
                });
            }
        );
    } catch (error) {
        return res.status(500).json({ message: error });
    }
};

// Reset password
const resetPassword = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
        return res.status(400).json({ message: errors.array() });

    try {
        const email = req.body.email;
        const data = await userModel.findOne({ email: email });
        if (data === null)
            return res
                .status(404)
                .json({ message: "Your account has not been founded." });
        else if (data.isVerified === false)
            return res.status(403).json({
                message:
                    "Your account has not been verified. Please verify your account.",
            });
        else if (data.confirm_otp !== req.body.confirm_otp)
            return res
                .status(400)
                .json({ message: "Your password reset code is invalid." });

        bcrypt.hash(req.body.new_password, 10, (err, hash) => {
            if (err) return res.status(500).json({ message: err });
            console.log(hash);
            userModel.findOneAndUpdate(
                { email: email },
                {
                    $set: {
                        password: hash,
                        confirm_otp: null,
                    },
                },
                { multi: false },
                (err, result) => {
                    if (err) return res.status(500).json({ message: err });
                    return res.status(200).json({
                        message: "Your password has been successfully changed.",
                    });
                }
            );
        });
    } catch (error) {
        return res.status(500).json({ message: error });
    }
};

module.exports = {
    createNewUser,
    userLogin,
    accountVerify,
    resendConfirmOTP,
    forgotPassword,
    resetPassword,
};
