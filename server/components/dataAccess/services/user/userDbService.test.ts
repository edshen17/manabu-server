// import { expect } from 'chai';
// import { DbServiceAccessOptions } from '../../abstractions/IDbService';
// import { UserDbService } from './userDbService';
// import { makeUserDbService } from '.';
// import { makeFakeDbUserFactory } from '../../testFixtures/fakeDbUserFactory';
// import { FakeDbUserFactory } from '../../testFixtures/fakeDbUserFactory/fakeDbUserFactory';
// import { PackageTransactionDoc } from '../../../../models/PackageTransaction';
// import { makeFakeDbPackageTransactionFactory } from '../../testFixtures/fakeDbPackageTransactionFactory';
// import { FakeDbPackageTransactionFactory } from '../../testFixtures/fakeDbPackageTransactionFactory/fakeDbPackageTransactionFactory';
// import { PackageTransactionDbService } from '../packageTransaction/packageTransactionDbService';
// import { makePackageTransactionDbService } from '../packageTransaction';
// import { AppointmentDbService } from '../appointment/appointmentDbService';
// import { makeAppointmentDbService } from '../appointment';
// import { FakeDbAppointmentFactory } from '../../testFixtures/fakeDbAppointmentFactory/fakeDbAppointmentFactory';
// import { makeFakeDbAppointmentFactory } from '../../testFixtures/fakeDbAppointmentFactory';
// import { AppointmentDoc } from '../../../../models/Appointment';
// import { JoinedUserDoc } from '../../../../models/User';
// import { MinuteBankDoc } from '../../../../models/MinuteBank';
// import { FakeDbMinuteBankFactory } from '../../testFixtures/fakeDbMinuteBankFactory/fakeDbMinuteBankFactory';
// import { makeFakeDbMinuteBankFactory } from '../../testFixtures/fakeDbMinuteBankFactory';
// import { MinuteBankDbService } from '../minuteBank/minuteBankDbService';
// import { makeMinuteBankDbService } from '../minuteBank';

// let userDbService: UserDbService;
// let packageTransactionDbService: PackageTransactionDbService;
// let appointmentDbService: AppointmentDbService;
// let minuteBankDbService: MinuteBankDbService;
// let dbServiceAccessOptions: DbServiceAccessOptions;
// let fakeDbUserFactory: FakeDbUserFactory;
// let fakeDbPackageTransactionFactory: FakeDbPackageTransactionFactory;
// let fakeDbAppointmentFactory: FakeDbAppointmentFactory;
// let fakeDbMinuteBankFactory: FakeDbMinuteBankFactory;
// let fakeUser: JoinedUserDoc;
// let fakeTeacher: JoinedUserDoc;
// let fakePackageTransaction: PackageTransactionDoc;
// let fakeAppointment: AppointmentDoc;
// let fakeMinuteBank: MinuteBankDoc;

// before(async () => {
//   userDbService = await makeUserDbService;
//   packageTransactionDbService = await makePackageTransactionDbService;
//   appointmentDbService = await makeAppointmentDbService;
//   minuteBankDbService = await makeMinuteBankDbService;
//   fakeDbUserFactory = await makeFakeDbUserFactory;
//   fakeDbPackageTransactionFactory = await makeFakeDbPackageTransactionFactory;
//   fakeDbAppointmentFactory = await makeFakeDbAppointmentFactory;
//   fakeDbMinuteBankFactory = await makeFakeDbMinuteBankFactory;
// });

// beforeEach(async () => {
//   dbServiceAccessOptions = fakeDbUserFactory.getDbServiceAccessOptions();
//   fakeUser = await fakeDbUserFactory.createFakeDbUser();
//   fakeTeacher = await fakeDbUserFactory.createFakeDbTeacherWithDefaultPackages();
//   fakePackageTransaction = await fakeDbPackageTransactionFactory.createFakeDbData({
//     hostedById: fakeTeacher._id,
//     reservedById: fakeUser._id,
//     packageId: fakeTeacher.teacherData!.packages[0]._id,
//     lessonDuration: 60,
//     priceData: { currency: 'SGD', subTotal: 0, total: 0 },
//     remainingAppointments: 0,
//     lessonLanguage: 'ja',
//     isSubscription: false,
//     paymentData: {},
//   });
//   fakeAppointment = await fakeDbAppointmentFactory.createFakeDbData({
//     hostedById: fakePackageTransaction.hostedById,
//     reservedById: fakePackageTransaction.reservedById,
//     packageTransactionId: fakePackageTransaction._id,
//     startTime: new Date(),
//     endTime: new Date(),
//   });
//   fakeMinuteBank = await fakeDbMinuteBankFactory.createFakeDbData({
//     hostedById: fakeTeacher._id,
//     reservedById: fakeUser._id,
//   });
// });

// describe('userDbService', () => {
//   describe('findById, findOne, find', () => {
//     context('db access permitted', () => {
//       context('invalid inputs', () => {
//         it('should throw an error if given an invalid id', async () => {
//           try {
//             const findByIdUser = await userDbService.findById({
//               _id: 'undefined',
//               dbServiceAccessOptions,
//             });
//           } catch (err) {
//             expect(err).to.be.an('error');
//           }
//         });
//         it('should return undefined if given a non-existent id', async () => {
//           const findByIdUser = await userDbService.findById({
//             _id: '60979db0bb31ed001589a1ea',
//             dbServiceAccessOptions,
//           });
//           expect(findByIdUser).to.equal(null);
//         });
//       });
//       context('valid inputs', () => {
//         context('as a non-admin user', () => {
//           context('viewing other', () => {
//             it('should return a restricted view of another user', async () => {
//               const findByIdUser = await userDbService.findById({
//                 _id: fakeUser._id,
//                 dbServiceAccessOptions,
//               });
//               const findOneUser = await userDbService.findOne({
//                 searchQuery: {
//                   _id: fakeUser._id,
//                 },
//                 dbServiceAccessOptions,
//               });
//               const findUsers = await userDbService.find({
//                 searchQuery: {
//                   _id: fakeUser._id,
//                 },
//                 dbServiceAccessOptions,
//               });
//               expect(findByIdUser).to.deep.equal(findOneUser);
//               expect(findByIdUser).to.deep.equal(findUsers[0]);
//               expect(findByIdUser).to.not.have.property('email');
//               expect(findByIdUser).to.not.have.property('password');
//               expect(findByIdUser).to.not.have.property('verificationToken');
//               expect(findByIdUser).to.not.have.property('settings');
//               expect(findByIdUser).to.not.have.property('contactMethods');
//             });
//             it('should return a joined restricted view of another teacher', async () => {
//               const findByIdTeacher = await userDbService.findById({
//                 _id: fakeTeacher._id,
//                 dbServiceAccessOptions,
//               });
//               expect(findByIdTeacher).to.have.property('teacherData');
//               expect(findByIdTeacher.teacherData).to.have.property('packages');
//               expect(findByIdTeacher.teacherData).to.not.have.property('licensePathUrl');
//               expect(findByIdTeacher.teacherData!.applicationStatus).to.equal('pending');
//               expect(findByIdTeacher).to.not.have.property('email');
//               expect(findByIdTeacher).to.not.have.property('password');
//               expect(findByIdTeacher).to.not.have.property('verificationToken');
//               expect(findByIdTeacher).to.not.have.property('settings');
//               expect(findByIdTeacher).to.not.have.property('contactMethods');
//               expect(fakeTeacher).to.deep.equal(findByIdTeacher);
//             });
//           });
//           context('viewing self', () => {
//             it('should return a less restricted view of a user', async () => {
//               dbServiceAccessOptions.isSelf = true;
//               const findByIdUser = await userDbService.findById({
//                 _id: fakeUser._id,
//                 dbServiceAccessOptions,
//               });
//               expect(findByIdUser).to.not.have.property('password');
//               expect(findByIdUser).to.not.have.property('verificationToken');
//               expect(findByIdUser).to.have.property('email');
//               expect(findByIdUser).to.have.property('settings');
//               expect(findByIdUser).to.have.property('contactMethods');
//             });
//             it('should return a less restricted view of a teacher', async () => {
//               dbServiceAccessOptions.isSelf = true;
//               const findByIdTeacher = await userDbService.findById({
//                 _id: fakeTeacher._id,
//                 dbServiceAccessOptions,
//               });
//               expect(findByIdTeacher.teacherData).to.have.property('licensePathUrl');
//             });
//           });
//           context('overriding default select view', () => {
//             it('should return an user with the password field', async () => {
//               dbServiceAccessOptions.isOverrideView = true;
//               const findByIdUser = await userDbService.findById({
//                 _id: fakeUser._id,
//                 dbServiceAccessOptions,
//               });

//               expect(findByIdUser).to.have.property('password');
//             });
//           });
//         });
//         context('as an admin', () => {
//           it('should return additional restricted data', async () => {
//             dbServiceAccessOptions.currentAPIUserRole = 'admin';
//             const findByIdTeacher = await userDbService.findById({
//               _id: fakeTeacher._id,
//               dbServiceAccessOptions,
//             });
//             expect(findByIdTeacher.teacherData).to.have.property('licensePathUrl');
//             expect(findByIdTeacher).to.have.property('email');
//             expect(findByIdTeacher).to.have.property('settings');
//             expect(findByIdTeacher).to.have.property('contactMethods');
//             expect(findByIdTeacher).to.not.have.property('password');
//             expect(findByIdTeacher).to.not.have.property('verificationToken');
//           });
//         });
//       });
//     });
//     context('db access denied', () => {
//       it('should throw an error', async () => {
//         dbServiceAccessOptions.isCurrentAPIUserPermitted = false;
//         try {
//           const findByIdUser = await userDbService.findById({
//             _id: fakeUser._id,
//             dbServiceAccessOptions,
//           });
//         } catch (err) {
//           expect(err).to.be.an('error');
//           expect(err.message).to.equal('Access denied.');
//         }
//       });
//     });
//   });
//   describe('insert', () => {
//     context('db access permitted', () => {
//       context('valid inputs', () => {
//         it('should insert a new user into the db', async () => {
//           //TODO: create a new user for clarity
//           const searchUser = await userDbService.findById({
//             _id: fakeUser._id,
//             dbServiceAccessOptions,
//           });
//           expect(fakeUser).to.deep.equal(searchUser);
//         });
//       });
//       context('invalid inputs', () => {
//         it('should throw an error when creating a duplicate user', async () => {
//           try {
//             const dupeEntityData = {
//               name: 'some name',
//               email: 'duplicateEmail@email.com',
//             };
//             const fakeUser = await fakeDbUserFactory.createFakeDbData(dupeEntityData);
//             const dupeUser = await fakeDbUserFactory.createFakeDbData(dupeEntityData);
//           } catch (err) {
//             expect(err).be.an('error');
//           }
//         });
//         it('should throw an error when required fields are not given', async () => {
//           try {
//             const fakeUser = await userDbService.insert({
//               modelToInsert: {},
//               dbServiceAccessOptions,
//             });
//           } catch (err) {
//             expect(err).be.an('error');
//           }
//         });
//       });
//     });
//     context('db access denied', () => {
//       it('should throw an error', async () => {
//         try {
//           dbServiceAccessOptions.isCurrentAPIUserPermitted = false;
//           const entityData = {
//             name: 'test',
//             email: 'someEmail@email.com',
//           };
//           const fakeUser = await fakeDbUserFactory.createFakeDbData(entityData);
//         } catch (err) {
//           expect(err).to.be.an('error');
//           expect(err.message).to.equal('Access denied.');
//         }
//       });
//     });
//   });
//   describe('update', () => {
//     context('db access permitted', () => {
//       context('valid inputs', () => {
//         context('as non-admin user', () => {
//           context('updating self', () => {
//             it('should update db document and return a less restricted view', async () => {
//               dbServiceAccessOptions.isSelf = true;
//               const updatedTeacher = await userDbService.findOneAndUpdate({
//                 searchQuery: { _id: fakeTeacher._id },
//                 updateQuery: {
//                   name: 'updated name',
//                   $pull: {
//                     'teacherData.packages': {
//                       _id: fakeTeacher.teacherData!.packages[0]._id,
//                     },
//                   },
//                 },
//                 dbServiceAccessOptions,
//               });
//               expect(updatedTeacher.name).to.equal('updated name');
//               expect(updatedTeacher).to.have.property('email');
//               expect(updatedTeacher).to.have.property('settings');
//               expect(updatedTeacher).to.have.property('contactMethods');
//               expect(updatedTeacher).to.not.have.property('password');
//               expect(updatedTeacher).to.not.have.property('verficiationToken');
//             });
//             it('should update db dependencies with restricted views', async () => {
//               dbServiceAccessOptions.isSelf = true;
//               expect(fakePackageTransaction.hostedByData).to.deep.equal(fakeTeacher);
//               const updatedTeacher = await userDbService.findOneAndUpdate({
//                 searchQuery: { _id: fakeTeacher._id, 'contactMethods.methodName': 'LINE' },
//                 updateQuery: {
//                   name: 'updated name',
//                   $set: {
//                     'contactMethods.$.methodName': 'Skype',
//                   },
//                 },
//                 dbServiceAccessOptions,
//               });
//               expect(updatedTeacher.name).to.equal('updated name');
//               const updatedPackageTransaction = await packageTransactionDbService.findOne({
//                 searchQuery: { hostedById: fakeTeacher._id },
//                 dbServiceAccessOptions,
//               });
//               const updatedMinuteBank = await minuteBankDbService.findOne({
//                 searchQuery: { hostedById: fakeTeacher._id },
//                 dbServiceAccessOptions,
//               });
//               const packageTransactionHostedByData = updatedPackageTransaction.hostedByData;
//               expect(packageTransactionHostedByData.name).to.equal(updatedTeacher.name);
//               expect(packageTransactionHostedByData).to.not.have.property('email');
//               expect(packageTransactionHostedByData).to.not.have.property('contactMethods');
//               expect(packageTransactionHostedByData.teacherData).to.not.have.property(
//                 'licensePathUrl'
//               );
//               expect(updatedMinuteBank.hostedByData.name).to.equal(updatedTeacher.name);
//               expect(updatedMinuteBank.hostedByData).to.not.have.property('contactMethods');
//             });
//           });
//           context('updating others', () => {
//             it('should update db document and return a restricted view', async () => {
//               const updatedTeacher = await userDbService.findOneAndUpdate({
//                 searchQuery: { _id: fakeTeacher._id },
//                 updateQuery: { profileBio: 'updated bio' },
//                 dbServiceAccessOptions,
//               });
//               expect(updatedTeacher.profileBio).to.equal('updated bio');
//               expect(updatedTeacher).to.not.have.property('email');
//               expect(updatedTeacher).to.not.have.property('settings');
//               expect(updatedTeacher).to.not.have.property('commTools');
//               expect(updatedTeacher).to.not.have.property('password');
//               expect(updatedTeacher).to.not.have.property('verficiationToken');
//             });
//           });
//         });
//         context('as admin', () => {
//           it('should update db document and return a less restricted view', async () => {
//             dbServiceAccessOptions.currentAPIUserRole = 'admin';
//             const updatedTeacher = await userDbService.findOneAndUpdate({
//               searchQuery: { _id: fakeTeacher._id },
//               updateQuery: { profileImageUrl: 'updated image' },
//               dbServiceAccessOptions,
//             });
//             expect(updatedTeacher.teacherData).to.have.property('licensePathUrl');
//             expect(updatedTeacher.profileImageUrl).to.equal('updated image');
//             expect(updatedTeacher).to.have.property('email');
//             expect(updatedTeacher).to.have.property('settings');
//             expect(updatedTeacher).to.have.property('contactMethods');
//             expect(updatedTeacher).to.not.have.property('password');
//             expect(updatedTeacher).to.not.have.property('verficiationToken');
//           });
//         });
//       });
//       context('invalid inputs', () => {
//         it('should return the original user if the update field does not exist', async () => {
//           const updatedTeacher = await userDbService.findOneAndUpdate({
//             searchQuery: { _id: fakeTeacher._id },
//             updateQuery: { nonExistentField: 'some-non-existent-field' },
//             dbServiceAccessOptions,
//           });
//           expect(updatedTeacher).to.deep.equal(fakeTeacher);
//         });
//         it('should return undefined if the user to update does not exist', async () => {
//           const updatedTeacher = await userDbService.findOneAndUpdate({
//             searchQuery: { email: fakeTeacher._id },
//             updateQuery: { profileImageUrl: 'updated image' },
//             dbServiceAccessOptions,
//           });
//           expect(updatedTeacher).to.equal(null);
//         });
//       });
//     });
//     context('db access denied', () => {
//       it('should throw an error', async () => {
//         try {
//           dbServiceAccessOptions.isCurrentAPIUserPermitted = false;
//           const updatedTeacher = await userDbService.findOneAndUpdate({
//             searchQuery: { _id: fakeTeacher._id },
//             updateQuery: { profileImageUrl: 'updated image' },
//             dbServiceAccessOptions,
//           });
//         } catch (err) {
//           expect(err.message).to.equal('Access denied.');
//         }
//       });
//     });
//   });
// });
