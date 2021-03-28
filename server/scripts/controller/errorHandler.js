const { GeneralError } = require('./utils/errors');
const dotenv = require('dotenv').config();
const nodemailer = require('nodemailer')

const handleErrors = async (err, req, res, next) => {
  console.log(err);
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