const nodemailer = require("nodemailer");
const dotenv = require('dotenv').config();

let host = 'https://manabu.sg';
if (process.env.NODE_ENV != 'production') {
    host = 'http://localhost:8080'
}

const sendVerificationEmail = async (email, verificationToken) => {
  try {
    let transporter = nodemailer.createTransport({
      host: 'mail.privateemail.com',
      port: 587,
      secure: false,
      secure: false, // true for 465, false for other ports
      auth: {
        user: 'support@manabu.sg',
        pass: process.env.MANABU_EMAIL_SUPPORT_PASS,
      },
    })
  
    // send mail with defined transport object
    let info = await transporter.sendMail({
      from: 'Manabu Support <support@manabu.sg>', // sender address
      to: email, // list of receivers
      subject: "Please confirm your email", // Subject line
      html: `Click <a href="${host}/api/user/verify/${verificationToken}">here</a> to verify your email.`,
    }).catch((err) => { return; });
  } catch (err) {
    console.log(err.message, 'here');
  }
    
}

module.exports = sendVerificationEmail;