const userModel = require("../model/user-model");
const bcrypt = require("bcrypt");
const { validationResult, check } = require("express-validator");
const { randomNumber } = require("../utils/otp-generator");
const { sentMail } = require("../utils/mail-sender");

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
                sentMail(req.body.email, otp);
                return res.status(201).json({
                    message: "verification code sent to your email address.",
                });
            });
        } catch (error) {
            return res.status(500).json({ Error: error });
        }
    });
};

module.exports = {
    createNewUser,
};
