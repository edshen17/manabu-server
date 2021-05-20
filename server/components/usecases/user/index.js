const makeListUsers = require('./getUsers');
const { makeAddUser } = require('./addUser');
const { usersDb } = require('../../data-access/index')
const listUsers = makeListUsers({ usersDb })

const addUser = makeAddUser({ usersDb })
const userService = Object.freeze({
  listUsers,
  addUser,
})

module.exports = {
    userService,
    listUsers,
    addUser,
}
