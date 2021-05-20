function makeListUsers ({ usersDb }) {
    return async function listUsers ({ uId } = {}) {
      if (!uId) {
        throw new Error('You must supply an user id.')
      }
      const users = await usersDb.findById(uId)
      return users;
    }
  }
  module.exports = makeListUsers;
  