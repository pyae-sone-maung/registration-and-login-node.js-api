const userModel = require("../model/user-model");
const bcrypt = require("bcrypt");
const { validationResult, check } = require("express-validator");
const { randomNumber } = require("../utils/otp-generator");
const { mailSender } = require("../utils/mail-sender");

const createNewUser = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
        return res.status(400).json({ Error: errors.array() });

    const isEmailExist = await userModel.findOne({ email: req.body.email });
    if (isEmailExist)
        return res
            .status(400)
            .json({ Error: "Email address is already exist." });

    bcrypt.hash(req.body.password, 10, (err, hash) => {
        if (err) return res.status(500).json({ Error: err.array() });
        try {
            const otp = randomNumber(6);
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
                if (err) return res.status(500).json({ Error: err });

                const html =
                    "<p> Dear " +
                    data[0].name +
                    ", </p> </br> </br> <p> Please find below the verification code to complete your registration. </br> </br> <h3> Verification Code: " +
                    data[0].confirm_otp +
                    " </h3> </br> </br> <p> Please feel free to contact us if you have any question.Thank you.</p> </br> <p> Best Regards,</p>";

                mailSender(req.body.email, html, otp);
                return res.status(201).json({
                    message: "verification code sent to your email address.",
                });
            });
        } catch (error) {
            return res.status(500).json({ Error: error });
        }
    });
};

const userLogin = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
        return res.status(400).json({ Error: errors.array() });

    const { email, password } = req.body;
    try {
        const data = await userModel.findOne({ email: email });
        if (data === null) return res.sendStatus(404);
        if (data.isVerified === false)
            return res
                .status(401)
                .json({ message: "Your account is not verified." });

        bcrypt.compare(password, data.password, (err, result) => {
            if (result === false)
                return res
                    .status(401)
                    .json({ Error: "email and password are not match." });
            return res.status(200).json({
                meta: { message: "login successfully" },
                data,
            });
        });
    } catch (error) {
        return res.status(500).json({ Error: error });
    }
};

module.exports = {
    createNewUser,
    userLogin,
};
