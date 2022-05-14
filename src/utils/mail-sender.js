const nodemailer = require("nodemailer");

const mailSender = (subject, receiverMail, html, otp) => {
    let transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.SENDER_MAIL_ADDRESS,
            pass: process.env.SENDER_MAIL_PASSWORD,
        },
    });

    let mailOptions = {
        from: "<no-reply>register-login@project.com",
        to: receiverMail,
        subject: subject,
        html: html,
    };

    transporter.sendMail(mailOptions);
};

module.exports = { mailSender };
