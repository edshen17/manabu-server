const bcrypt = require('bcryptjs');
const sanitizeHtml = require('sanitize-html');
const jwt = require('jsonwebtoken');
const cryptoRandomString = require('crypto-random-string');
const dotenv = require('dotenv').config();
const { buildMakeUser } = require('./user');
const { buildMakeTeacher } = require('./teacher');

const sanitize = (text) => {
  // TODO: configure sanitizeHtml
  return sanitizeHtml(text);
};

const randTokenGenerator = ({ name, email }) => {
  const randToken = cryptoRandomString({ length: 15 });
  const verificationToken = jwt.sign(
    { randToken: randToken, name, email },
    process.env.JWT_SECRET,
    {
      expiresIn: 86400 * 7, // expires in 7 days
    }
  );
  return verificationToken;
};

const inputValidator = {
  // TODO: Finish all validations
  isValidName: () => {
    return true;
  },
  isValidEmail: () => {
    return true;
  },
  isValidPassword: () => {
    return true;
  },
  isValidURL: () => {
    return true;
  },
};

const passwordHasher = (password) => {
  return bcrypt.hashSync(password, 10);
};

const makeUser = buildMakeUser({ sanitize, inputValidator, passwordHasher, randTokenGenerator });
const makeTeacher = buildMakeTeacher({});
module.exports = { makeUser, makeTeacher };
