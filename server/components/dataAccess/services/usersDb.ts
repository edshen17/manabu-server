import { IDbOperations } from '../abstractions/IDbOperations';
import { UserDoc } from '../../../models/User';
import { CommonDbOperations } from '../abstractions/CommonDbOperations';

class UserDbService extends CommonDbOperations implements IDbOperations {
  private userDb: any;
  private teacherDbService: any;
  private packageDbService: any;

  constructor(props: any) {
    super();
    this.userDb = props.userDb;
    this.teacherDbService = props.teacherDbService;
    this.packageDbService = props.packageDbService;
  }

  private _joinUserTeacher = async (user: UserDoc): Promise<{} | Error> => {
    const userCopy = JSON.parse(JSON.stringify(user));
    const teacher = await this.teacherDbService.findByUserId(user._id);
    // const packages = await this.packageDbService.findByHostedBy(user._id);
    const packages = {}; //TODO FILL OUT
    if (teacher) {
      userCopy.teacherAppPending = !teacher.isApproved;
      userCopy.teacherData = teacher;
      userCopy.teacherData.packages = packages;
    }
    return userCopy;
  };

  //TODO: findById with admin stuff
  public findById = async (id: string, currentAPIUser: any): Promise<{} | Error> => {
    const user: UserDoc = await this.userDb.findById(id);
    if (user) return await this._joinUserTeacher(user);
    else throw new Error('User not found.');
  };

  public findOne = async (searchQuery: {}): Promise<{} | Error> => {
    const user: UserDoc = await this.userDb.findOne(searchQuery);
    if (user) return await this._joinUserTeacher(user);
    else throw new Error('User not found.');
  };

  //TODO: Finish with join
  public insert = async (modelToInsert: {}): Promise<{} | Error> => {
    const result = await this.userDb.create(modelToInsert);
    return result;
  };

  //TODO: Finish
  public update = async (searchQuery: {}): Promise<{} | Error> => {
    const result = await this.userDb.create(searchQuery);
    return result;
  };
}

export { UserDbService };

// function makeUsersDb({
//   makeDb,
//   User,
//   Teacher,
//   Package,
//   clearKey,
//   clearSpecificKey,
//   updateSpecificKey,
// }) {
//   return Object.freeze({
//     findById,
//     insert,
//     update,
//     findOne,
//     clearKeyInCache,
//   });

//   /**
//    * Find a user by id and joins user/teacher.
//    * @param {String} id user id
//    * @param {Object} currentUser object containing information from verifyToken (current requesting user's role, etc)
//    * @returns Object user data
//    */
//   async function findById(id, currentAPIUser) {
//     const db = await makeDb();
//     let selectOptions = {
//       email: 0,
//       password: 0,
//       verificationToken: 0,
//     };

//     if (currentAPIUser.role == 'admin') selectOptions = { password: 0, verificationToken: 0 };
//     if (currentAPIUser.userId != id) {
//       // if not self, do not include settings
//       selectOptions.settings = 0;
//     }
//     const user = await User.findById(id, selectOptions).lean().cache();
//     if (user) return await _joinUserTeacher(user, Teacher, Package);
//     else return null;
//   }

//   async function findOne(attrObj) {
//     const db = await makeDb();
//     const user = await User.findOne(attrObj).lean().cache();
//     if (user) return await _joinUserTeacher(user, Teacher, Package);
//     else return null;
//   }

//   async function insert(...userData) {
//     const db = await makeDb();
//     const newUser = await new User(...userData).save();
//     if (newUser) {
//       clearKeyInCache();
//       return await _joinUserTeacher(newUser, Teacher, Package);
//     } else throw new Error('Something went during user creation.');
//   }

//   async function update({ id: _id, ...commentInfo }) {
//     const result = await db.collection('users').updateOne({ _id }, { $set: { ...commentInfo } });
//     return result.modifiedCount > 0 ? { id: _id, ...commentInfo } : null;
//   }

//   function clearKeyInCache() {
//     return clearKey(User.collection.collectionName);
//   }
// }

// module.exports = makeUsersDb;
