const nodemailer = require("nodemailer");

const sentMail = (receiverMail, otp) => {
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
        text: "otp,",
    };

    transporter.sendMail(mailOptions);
};

module.exports = { sentMail };
