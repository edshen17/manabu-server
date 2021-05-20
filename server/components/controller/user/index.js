const { listUsers, addUser } = require('../../usecases/user/index')
const makeGetUsers = require('./getUsers')
const getUsers = makeGetUsers({ listUsers });
const { makeAddUser } = require('./addUser')
const createUser = makeAddUser({ addUser })

const userController = Object.freeze({
    getUsers,
    createUser,
})

module.exports = {
    userController,
    getUsers,
    createUser,
};