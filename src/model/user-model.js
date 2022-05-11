const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
    {
        name: { type: String },
        email: { type: String, unique: true },
        date_of_birth: { type: Date },
        gender: { type: String },
        phone: { type: String },
        address: { type: String },
        password: { type: String },
        confirm_otp: { type: String },
        isVerified: { type: Boolean, default: false },
    },
    { versionKey: false },
    { timestamp: true }
);

module.exports = mongoose.model("users", userSchema);
