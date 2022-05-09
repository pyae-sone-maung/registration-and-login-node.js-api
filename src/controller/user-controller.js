const userModel = require("../model/user-model");
const bcrypt = require("bcrypt");
const { validationResult } = require("express-validator");
const { randomNumber } = require("../utils/otp-generator");

const createNewUser = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
        return res.status(400).json({ Error: errors.array() });

    const checkEmail = userModel.findOne({ email: req.body.email });
    if (checkEmail)
        return res
            .status(400)
            .json({ Error: "Email address is already exist." });

    bcrypt.hash(req.body.password, 10, async (err, hash) => {
        if (err) return res.status(500).json({ Error: err.array() });
        try {
            const user = {
                name: req.body.name,
                email: req.body.email,
                date_of_birth: new Date(req.body.date_of_birth), // YY / MM / DD
                gender: req.body.gender,
                phone: req.body.phone,
                address: req.body.address,
                password: hash,
                confirm_otp: randomNumber(6),
            };
            const data = await userModel.insertMany(user);
            return res
                .status(200)
                .json({ meta: { message: "create successfully" }, data });
        } catch (error) {
            return res.status(500).json({ Error: error });
        }
    });
    console.log("create successfully");
};

module.exports = {
    createNewUser,
};
