function makeUsersDb({
  makeDb,
  User,
  Teacher,
  Package,
  clearKey,
  clearSpecificKey,
  updateSpecificKey,
}) {
  return Object.freeze({
    findById,
    insert,
    update,
    findOne,
    clearKeyCache,
  });

  async function _joinUserTeacher(user) {
    user = JSON.parse(JSON.stringify(user));
    const teacherQuery = {
      _id: 0,
      licensePath: 0,
    };
    const teacher = JSON.parse(
      JSON.stringify(
        await Teacher.findOne(
          {
            userId: user._id,
          },
          teacherQuery
        )
          .lean()
          .cache()
      )
    );

    if (teacher) {
      const packages = JSON.parse(
        JSON.stringify(
          await Package.find({
            hostedBy: user._id,
          })
            .lean()
            .cache()
        )
      );

      user.teacherAppPending = !teacher.isApproved;
      user.teacherData = teacher;
      user.teacherData.packages = packages;
    }

    return user;
  }

  /**
   * Find a user by id.
   * @param {String} id user id
   * @param {Object} currentUser object containing information from verifyToken (current requesting user's role, etc)
   * @returns Object user data
   */
  async function findById(id, currentAPIUser) {
    const db = await makeDb();
    let selectOptions = {
      email: 0,
      password: 0,
      verificationToken: 0,
    };

    if (currentAPIUser.role == 'admin') selectOptions = { password: 0, verificationToken: 0 };
    if (currentAPIUser.userId != id) {
      // if not self, do not include settings
      selectOptions.settings = 0;
    }
    const user = await User.findById(id, selectOptions).lean().cache();
    if (user) return _joinUserTeacher(user);
    else return null;
  }
  async function findOne(attrObj) {
    const db = await makeDb();
    const user = await User.findOne(attrObj).lean().cache();
    if (user) return _joinUserTeacher(user);
    else return null;
  }
  async function insert(...userData) {
    const db = await makeDb();
    const newUser = await new User(...userData).save();
    if (newUser) {
      clearKeyCache();
      return _joinUserTeacher(newUser);
    } else throw new Error('Something went during user creation.');
  }

  async function update({ id: _id, ...commentInfo }) {
    const result = await db.collection('users').updateOne({ _id }, { $set: { ...commentInfo } });
    return result.modifiedCount > 0 ? { id: _id, ...commentInfo } : null;
  }

  function clearKeyCache() {
    return clearKey(User.collection.collectionName);
  }
}

module.exports = makeUsersDb;
