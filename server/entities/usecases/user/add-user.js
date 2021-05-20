const makeUser = require('../../user/user');

export default function makeAddUser ({ userDb }) {
  return async function addUser (userData) {
    const user = makeUser(userData)
    const exists = await userDb.findOne({ email: user.getEmail() })
    if (exists) {
      return exists
    }

    return userDb.insert({
      name: user.getName(),
      email: user.getEmail(),
      password: user.getPassword(),
      profileImage: user.getProfileImage(),
      profileBio: user.getProfileBio(),
      dateRegistered: user.getDateRegistered(),
      lastUpdated: user.getLastUpdated(),
      languages: user.getLanguages(),
      region: user.getRegion(),
      timezone: user.getTimeZone(),
      settings: {
        currency: 'SGD',
      },
      commMethods: user.getCommMethods(),
      emailVerified: user.getEmailVerified(),
      verificationToken: user.getVerificationToken(),
    })
  }
}
