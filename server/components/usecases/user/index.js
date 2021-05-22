const { makeGetUserUsecase } = require('./getUserUsecase');
const { makePostUserUsecase } = require('./postUserUsecase');
const { usersDb, teachersDb } = require('../../dataAccess/index');
const jwt = require('jsonwebtoken');
const getUserUsecase = makeGetUserUsecase({ usersDb });
const postUserUsecase = makePostUserUsecase({ usersDb, teachersDb, jwt });
const userService = Object.freeze({
  getUserUsecase,
  postUserUsecase,
});

module.exports = {
  userService,
  getUserUsecase,
  postUserUsecase,
};
