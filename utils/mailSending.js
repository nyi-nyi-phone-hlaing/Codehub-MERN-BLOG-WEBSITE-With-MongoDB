const dotenv = require("dotenv").config();
const nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SENDER,
    pass: process.env.MAIL_PASSWORD,
  },
});

const mailSending = ({ to, subject, text, html }) => {
  transporter.sendMail({
    from: process.env.SENDER,
    to,
    subject,
    text,
    html,
  });
};

module.exports = mailSending;
