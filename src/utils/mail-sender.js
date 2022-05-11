const nodemailer = require("nodemailer");

const mailSender = (receiverMail, html, otp) => {
    let transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.SENDER_MAIL_ADDRESS,
            pass: process.env.SENDER_MAIL_PASSWORD,
        },
    });

    let mailOptions = {
        from: process.env.SENDER_MAIL_ADDRESS,
        to: receiverMail,
        subject: "Account verification code",
        html: html,
    };

    transporter.sendMail(mailOptions);
};

module.exports = { mailSender };
