const { postUserUsecase, getUserUsecase } = require('../../usecases/user/index');
const { makeGetUserController } = require('./getUserController');
const { makePostUserController } = require('./postUserController');

const getUserController = makeGetUserController({ getUserUsecase });
const postUserController = makePostUserController({ postUserUsecase });

const userControllerMain = Object.freeze({
  getUserController,
  postUserController,
});

module.exports = {
  userControllerMain,
  getUserController,
  postUserController,
};
