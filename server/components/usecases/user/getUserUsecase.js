function makeGetUserUsecase({ usersDb }) {
  return async function getUser({ uId, currentAPIUser, path } = {}) {
    if (!uId && !currentAPIUser.userId) {
      throw new Error();
    }
    const idToSearch = path == '/me' ? currentAPIUser.userId : uId;
    const user = await usersDb.findById(idToSearch, currentAPIUser);
    return user;
  };
}
module.exports = { makeGetUserUsecase };
