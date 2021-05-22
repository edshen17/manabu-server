const bcrypt = require('bcryptjs');
const sanitizeHtml = require('sanitize-html');
const { buildMakeUser } = require('./user');
const { buildMakeTeacher } = require('./teacher');
function sanitize(text) {
  // TODO: configure sanitizeHtml
  return sanitizeHtml(text);
}

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

const makeUser = buildMakeUser({ sanitize, inputValidator, passwordHasher });
const makeTeacher = buildMakeTeacher({});
module.exports = { makeUser, makeTeacher };
