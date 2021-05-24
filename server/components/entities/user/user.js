/**
 * Factory to build a user
 * @param {Function} inputValidator input inputValidator function injection
 * @returns Object returns function makeUser
 */
function buildMakeUser({ sanitize, inputValidator, passwordHasher, randTokenGenerator }) {
  // TODO: sanitize name
  return function makeUser({ name, email, password, profileImage } = {}) {
    if (!inputValidator.isValidName(name)) {
      throw new Error('User must have a valid name.');
    }
    if (!inputValidator.isValidEmail(email)) {
      throw new Error('User must have a valid email.');
    }
    if (!inputValidator.isValidPassword(password)) {
      throw new Error('User must have a valid password.');
    }

    return Object.freeze({
      getName: () => name,
      getEmail: () => email,
      getPassword: () => (password = passwordHasher(password)),
      getProfileImage: () => profileImage,
      getVerificationToken: () =>
        (verificationToken = randTokenGenerator({
          name,
          email,
        })),
    });
  };
}

module.exports = { buildMakeUser };
