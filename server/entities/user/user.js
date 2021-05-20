/**
 * Factor to build a user
 * @param {Function} inputValidator input inputValidator function injection
 * @returns Object returns function makeUser
 */
export default function buildMakeUser ({ sanitize, inputValidator, passwordHasher }) {
    return function makeUser ({
      name,
      email,
      password,
      profileImage,
      profileBio,
      dateRegistered = Date.now(),
      lastUpdated = Date.now(),
      languages = [],
      region,
      timezone,
      lastOnline = Date.now(),
      role = 'user',
      settings = {
        currency: 'SGD',
      },
      membership = [],
      commMethods,
      emailVerified = false,
      verificationToken,
    } = {}) {
      if (!inputValidator.isValidName(name)) {
        throw new Error('User must have a valid name.')
      }
      if (!inputValidator.isValidEmail(email)) {
        throw new Error('User must have a valid email.')
      }
      if (!inputValidator.isValidPassword(password)) {
        throw new Error('User must have a valid password.')
      }
      if (!inputValidator.isValidURL(profileImage)) {
        throw new Error('User must have a valid url image.')
      }
      if (!profileBio || profileBio.length < 1) {
        throw new Error('User profile must include at least one character of text.')
      }
      if (!region) {
        throw new Error('User must have a region.')
      }
      if (!timezone) {
        throw new Error('User must have a timezone.')
      }
      if (!commMethods) {
          throw new Error('User must have a valid communication method.')
      }
      
      let sanitizedBio = sanitize(profileBio).trim()
      
      if (sanitizedBio.length < 1) {
        throw new Error('User bio contains no usable text.')
      }
  
      return Object.freeze({
        getName: () => name,
        getEmail: () => email,
        getPassword: () => password || (password = passwordHasher(password)),
        getProfileImage: () => profileImage,
        getProfileBio: () => profileBio,
        getDateRegistered: () => dateRegistered,
        getLastUpdated: () => lastUpdated,
        getLanguages: () => languages,
        getLastOnline: () => lastOnline,
        getRole: () => role,
        getSettings: () => settings,
        getMembership: () => membership,
        getCommMethods: () => commMethods,
        getEmailVerified: () => emailVerified,
        getVerificationToken: () => verificationToken,
        verifyEmail: () => {
          emailVerified = true
        },
      })
    }
  }