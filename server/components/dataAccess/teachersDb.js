function makeTeachersDb({ makeDb, Teacher, clearKey, clearSpecificKey, updateSpecificKey }) {
  return Object.freeze({
    findByUserId,
    insert,
    update,
    findOne,
    clearKeyCache,
  });

  /**
   * Find a teacher by their user id.
   * @param {String} id user id
   * @returns Object user data
   */
  async function findByUserId(userId) {
    const db = await makeDb();
    const teacher = await Teacher.findOne({ userId: userId }).lean().cache();
    if (teacher) return teacher;
    else return null;
  }

  async function findOne(attrObj) {
    const db = await makeDb();
    const teacher = await Teacher.findOne(attrObj).lean().cache();
    if (teacher) return teacher;
    else return null;
  }

  async function insert(...teacherData) {
    const db = await makeDb();
    const newTeacher = await new Teacher(...teacherData).save();
    if (newTeacher) return newTeacher;
    else throw new Error('Something went during user creation.');
  }

  async function update({ id: _id, ...commentInfo }) {
    const result = await db.collection('users').updateOne({ _id }, { $set: { ...commentInfo } });
    return result.modifiedCount > 0 ? { id: _id, ...commentInfo } : null;
  }

  function clearKeyCache() {
    return clearKey(Teacher.collection.collectionName);
  }
}

module.exports = makeTeachersDb;
