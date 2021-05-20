const listUsers = require('../../usecases/user/index').listUsers;
const makeGetUsers = require('./getUsers')
const getUsers = makeGetUsers({ listUsers });

const userController = Object.freeze({
    getUsers
})

module.exports = {
    userController,
    getUsers,
};