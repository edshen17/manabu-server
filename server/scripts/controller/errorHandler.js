const { GeneralError } = require('./utils/errors');
const dotenv = require('dotenv').config();

const handleErrors = (err, req, res, next) => {
  let transporter = nodemailer.createTransport({
    host: 'mail.privateemail.com',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: 'support@manabu.sg',
      pass: process.env.MANABU_EMAIL_SUPPORT_PASS,
    },
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: 'Manabu Support <support@manabu.sg>', // sender address
    to: 'greencopter4444@gmail.com', // list of receivers
    subject: "err", // Subject line
    html: `${err}`,
  }).catch((err) => { console.log(err) });

  if (err instanceof GeneralError) {
    return res.status(err.getCode()).json({
      status: 'error',
      message: err.message
    });
  }
  return res.status(500).json({
    status: 'error',
    message: err.message
  });
}


module.exports = handleErrors;