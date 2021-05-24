const { makeUser, makeTeacher } = require('../../entities/user/index');
const EmailHandler = require('../../entities/email/emailHandler');
const emailInstance = new EmailHandler();
const _sendVerificationEmail = (user) => {
  const host = 'https://manabu.sg';
  emailInstance.sendEmail(
    user.getEmail(),
    'NOREPLY',
    'Manabu email verification',
    'verificationEmail',
    {
      name: user.getName(),
      host,
      verificationToken: user.getVerificationToken(),
    }
  );
};

/**
 * Given a db user, generate a jwt.
 * @param {Object} savedDbUser
 * @returns {String} jwt token for auth purposes
 */
const _jwtToClient = (jwt, savedDbUser) => {
  const token = jwt.sign(
    {
      id: savedDbUser._id,
      role: savedDbUser.role,
      name: savedDbUser.name,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: 86400 * 7, // expires in 7 days
    }
  );
  return token;
};

/**
 * Handles errors to ensure a unique user.
 * @param {Object} userData given user data from req body
 * @param {Boolean} isTeacherApp if user is registering to be a teacher
 */
const _ensureUniqueUser = async (userData, isTeacherApp, usersDb) => {
  const user = makeUser(userData);
  const exists = await usersDb.findOne({ email: user.getEmail() });

  if (exists && isTeacherApp) {
    throw new Error('An account with that email already exists.');
  } else if (exists && isTeacherApp) {
    throw new Error(
      'You seem to already have an user account. Log in using the link below to connect that account with your teacher one.'
    );
  }
};

/**
 * Ensures all user ids in the teacher db is unique.
 * @param {Object} user
 * @param {Object} teachersDb
 */
const _ensureUniqueTeacher = async (user, teachersDb) => {
  const exists = await teachersDb.findByUserId(user._id);
  if (exists) {
    throw new Error('Teacher already exists.');
  }
};

/**
 * Inserts a user object into the db.
 * @param {Object} user
 * @param {Object} usersDb
 * @returns Promise
 */
const _insertUserIntoDb = async (user, usersDb) => {
  const savedDbUser = await usersDb.insert({
    name: user.getName(),
    email: user.getEmail(),
    password: user.getPassword(),
    profileImage: user.getProfileImage(),
    verificationToken: user.getVerificationToken(),
  });
  usersDb.clearKeyInCache();
  return savedDbUser;
};

/**
 * Insert a teacher into the db.
 * @param {Object} savedDbUser
 * @param {Object} teachersDb
 */
const _insertTeacherIntoDb = async (savedDbUser, teachersDb) => {
  const teacher = makeTeacher({ userId: savedDbUser._id });
  const savedDbTeacher = await teachersDb.insert({
    userId: teacher.getUserId(),
  });
  teachersDb.clearKeyInCache();
  return savedDbTeacher;
};

/**
 * Main function that adds the users in to the db, creates a teacher if there is one, and returns a token to the client.
 * ASSUMPTIONS: All users/teachers are unique when they are inserted into the db.
 * @param {Object} usersDb
 * @param {Object} teachersDb
 * @returns Function that does the tasks listed above
 */
function makePostUserUsecase({ usersDb, teachersDb, jwt }) {
  return async function addUser({ userData }) {
    const isTeacherApp = userData.isTeacherApp;
    const user = makeUser(userData);
    _ensureUniqueUser(userData, isTeacherApp, usersDb);
    const savedDbUser = await _insertUserIntoDb(user, usersDb);

    if (isTeacherApp) {
      _ensureUniqueTeacher(savedDbUser, teachersDb);
      await _insertTeacherIntoDb(savedDbUser, teachersDb);
    }

    _sendVerificationEmail(user);

    return _jwtToClient(jwt, savedDbUser);
  };
}

module.exports = { makePostUserUsecase };
