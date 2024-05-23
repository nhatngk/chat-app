const nodemailer = require("nodemailer");
const creeatError = require("http-errors");
const secret = require("../config/env");

const sendEmail = async (res, body, message) => {
  const transporter = nodemailer.createTransport({
    host: secret.email_host,
    service: secret.email_service,
    port: secret.email_port,
    secure: true,
    auth: {
      user: secret.email_user,
      pass: secret.email_pass,
    }
  });

  await transporter.verify(function (err, success) {
    if (err) throw creeatError(500, "Email server error. Please try again later!")
  });

  await transporter.sendMail(body, (err, data) => {
    if (err) throw creeatError(500, `Error happen when sending email!`)
    return res.status(201).json({ message })
  });
}

module.exports = sendEmail;