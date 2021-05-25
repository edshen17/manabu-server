/**
 * Finds the teacher with the user id in the db
 * @param {String} userId
 * @returns {Object} teacher
 */
async function _findTeacher(userId, Teacher) {
  const teacherQuery = {
    _id: 0,
    licensePath: 0,
  };

  const teacher = JSON.parse(
    JSON.stringify(
      await Teacher.findOne(
        {
          userId,
        },
        teacherQuery
      )
        .lean()
        .cache()
    )
  );
  return teacher;
}

async function _findPackages(hostedBy, Package) {
  const packages = JSON.parse(
    JSON.stringify(
      await Package.find({
        hostedBy,
      })
        .lean()
        .cache()
    )
  );

  return packages;
}

async function _joinUserTeacher(user, Teacher, Package) {
  user = JSON.parse(JSON.stringify(user));
  const teacher = await _findTeacher(user._id, Teacher);
  const packages = await _findPackages(user._id, Package);

  if (teacher) {
    user.teacherAppPending = !teacher.isApproved;
    user.teacherData = teacher;
    user.teacherData.packages = packages;
  }
  return user;
}

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
    clearKeyInCache,
  });

  /**
   * Find a user by id and joins user/teacher.
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
    if (user) return await _joinUserTeacher(user, Teacher, Package);
    else return null;
  }

  async function findOne(attrObj) {
    const db = await makeDb();
    const user = await User.findOne(attrObj).lean().cache();
    if (user) return await _joinUserTeacher(user, Teacher, Package);
    else return null;
  }

  async function insert(...userData) {
    const db = await makeDb();
    const newUser = await new User(...userData).save();
    if (newUser) {
      clearKeyInCache();
      return await _joinUserTeacher(newUser, Teacher, Package);
    } else throw new Error('Something went during user creation.');
  }

  async function update({ id: _id, ...commentInfo }) {
    const result = await db.collection('users').updateOne({ _id }, { $set: { ...commentInfo } });
    return result.modifiedCount > 0 ? { id: _id, ...commentInfo } : null;
  }

  function clearKeyInCache() {
    return clearKey(User.collection.collectionName);
  }
}

module.exports = makeUsersDb;
