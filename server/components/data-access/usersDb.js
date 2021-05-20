function makeUsersDb ({ makeDb, User }) {
  return Object.freeze({
    findById,
    insert,
    update,
    findOne,
  })
  async function findById (id) {
    const db = await makeDb()
    const result = await User.findById(id)
    return result;
  }
  async function findOne (attrObj) {
    const db = await makeDb()
    const result = await User.findOne(attrObj)
    return result;
  }
  async function insert (...userData) {
    const db = await makeDb();
    const newUser = await new User(... userData).save()
    return newUser;
  }

  async function update ({ id: _id, ...commentInfo }) {
    const result = await db
      .collection('users')
      .updateOne({ _id }, { $set: { ...commentInfo } })
    return result.modifiedCount > 0 ? { id: _id, ...commentInfo } : null
  }
}

module.exports = makeUsersDb;