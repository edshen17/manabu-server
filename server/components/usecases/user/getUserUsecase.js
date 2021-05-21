function makeGetUserUsecase ({ usersDb }) {
    return async function getUser ({ uId } = {}) {
      if (!uId) {
        throw new Error('You must supply an user id.')
      }
      const users = await usersDb.findById(uId)
      return users;
    }
  }
  module.exports = { makeGetUserUsecase };
  