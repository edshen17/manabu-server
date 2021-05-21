const { makeUser } = require('../../entities/user/index');

function makePostUserUsecase ({ usersDb }) {
  return async function addUser (userData) {
    const user = makeUser(userData)
    const exists = await usersDb.findOne({ email: user.getEmail() })
    if (exists) {
      throw new Error('An user with that email already exists')
    }

    return usersDb.insert({
      name: user.getName(),
      email: user.getEmail(),
      password: user.getPassword(),
      profileImage: user.getProfileImage(),
    })
  }
}

module.exports = { makePostUserUsecase }