function makeGetUserUsecase({ usersDb }) {
  return async function getUser({ uId, currentAPIUser } = {}) {
    if (!uId) {
      throw new Error('You must supply an user id.');
    }
    const users = await usersDb.findById(uId, currentAPIUser);
    return users;
  };
}
module.exports = { makeGetUserUsecase };
