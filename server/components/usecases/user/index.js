const { makeGetUserUsecase } = require('./getUserUsecase');
const { makePostUserUsecase } = require('./postUserUsecase');
const { usersDb } = require('../../dataAccess/index');

const getUserUsecase = makeGetUserUsecase({ usersDb });
const postUserUsecase = makePostUserUsecase({ usersDb });
const userService = Object.freeze({
  getUserUsecase,
  postUserUsecase,
});

module.exports = {
  userService,
  getUserUsecase,
  postUserUsecase,
};
