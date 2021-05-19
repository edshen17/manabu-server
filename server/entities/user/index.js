const bcrypt = require('bcryptjs');
const sanitizeHtml = require('sanitize-html');
const buildMakeUser = require('./user');

const makeUser = buildMakeUser({ sanitize, inputValidator, passwordHasher });

export default makeUser

function sanitize(text) {
  // TODO: configure sanitizeHtml
  return sanitizeHtml(text);
}

class inputValidator {
    // TODO: complete all validations
    isValidName() {
        return true;
    }

    isValidEmail() {
        return true;
    }

    isValidPassword() {
        return true;
    }

    isValidURL() {
        return true;
    }
}

const passwordHasher = (password) => {
    return bcrypt.hashSync(password, 10)
}