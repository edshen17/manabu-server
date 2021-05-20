const makeListUsers = require('./getUsers');
const usersDb = require('../../data-access/index')
const listUsers = makeListUsers({ usersDb })


const userService = Object.freeze({
  listUsers
})

module.exports = {
    userService,
    listUsers,
}
