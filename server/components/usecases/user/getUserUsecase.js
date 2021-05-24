function makeGetUserUsecase({ usersDb }) {
  return async function getUser({ uId, currentAPIUser } = {}) {
    if (!uId) {
      throw new Error('You must supply an user id.');
    }
    const user = await usersDb.findById(uId, currentAPIUser);
    return user;
  };
}
module.exports = { makeGetUserUsecase };
