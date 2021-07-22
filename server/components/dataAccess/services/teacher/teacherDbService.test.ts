// import { expect } from 'chai';
// import { makeTeacherDbService } from '.';
// import { AppointmentDoc } from '../../../../models/Appointment';
// import { MinuteBankDoc } from '../../../../models/MinuteBank';
// import { PackageTransactionDoc } from '../../../../models/PackageTransaction';
// import { JoinedUserDoc } from '../../../../models/User';
// import { DbServiceAccessOptions } from '../../abstractions/IDbService';
// import { makeFakeDbAppointmentFactory } from '../../testFixtures/fakeDbAppointmentFactory';
// import { FakeDbAppointmentFactory } from '../../testFixtures/fakeDbAppointmentFactory/fakeDbAppointmentFactory';
// import { makeFakeDbMinuteBankFactory } from '../../testFixtures/fakeDbMinuteBankFactory';
// import { FakeDbMinuteBankFactory } from '../../testFixtures/fakeDbMinuteBankFactory/fakeDbMinuteBankFactory';
// import { makeFakeDbPackageTransactionFactory } from '../../testFixtures/fakeDbPackageTransactionFactory';
// import { FakeDbPackageTransactionFactory } from '../../testFixtures/fakeDbPackageTransactionFactory/fakeDbPackageTransactionFactory';
// import { makeFakeDbUserFactory } from '../../testFixtures/fakeDbUserFactory';
// import { FakeDbUserFactory } from '../../testFixtures/fakeDbUserFactory/fakeDbUserFactory';
// import { makeAppointmentDbService } from '../appointment';
// import { AppointmentDbService } from '../appointment/appointmentDbService';
// import { makeMinuteBankDbService } from '../minuteBank';
// import { MinuteBankDbService } from '../minuteBank/minuteBankDbService';
// import { makePackageTransactionDbService } from '../packageTransaction';
// import { PackageTransactionDbService } from '../packageTransaction/packageTransactionDbService';
// import { makeUserDbService } from '../user';
// import { UserDbService } from '../user/userDbService';
// import { TeacherDbService } from './teacherDbService';

// let userDbService: UserDbService;
// let teacherDbService: TeacherDbService;
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
//   teacherDbService = await makeTeacherDbService;
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

// describe('teacherDbService', () => {
//   describe('findById, findOne, find', () => {
//     context('db access permitted', () => {
//       context('invalid inputs', () => {
//         it('should throw an error if given an invalid id', async () => {
//           try {
//             await teacherDbService.findById({
//               _id: undefined,
//               dbServiceAccessOptions,
//             });
//           } catch (err) {
//             expect(err).be.an('error');
//           }
//         });
//         it('should return null if given an non-existent id', async () => {
//           const findByIdTeacher = await teacherDbService.findById({
//             _id: '60979db0bb31ed001589a1ea',
//             dbServiceAccessOptions,
//           });
//           expect(findByIdTeacher).to.equal(null);
//         });
//       });
//       context('valid inputs', () => {
//         const getTeacher = async () => {
//           const findParams = {
//             searchQuery: {
//               _id: fakeTeacher.teacherData!._id,
//             },
//             dbServiceAccessOptions,
//           };
//           const findByIdTeacher = await teacherDbService.findById({
//             _id: fakeTeacher.teacherData!._id,
//             dbServiceAccessOptions,
//           });
//           const findOneTeacher = await teacherDbService.findOne(findParams);
//           const findTeachers = await teacherDbService.find(findParams);
//           expect(findByIdTeacher).to.deep.equal(findOneTeacher);
//           expect(findByIdTeacher).to.deep.equal(findTeachers[0]);
//           return findByIdTeacher;
//         };
//         context('as a non-admin user', () => {
//           context('viewing self', () => {
//             it('should find the teacher and return an unrestricted view', async () => {
//               dbServiceAccessOptions.isSelf = true;
//               const findByIdTeacher = await getTeacher();
//               expect(findByIdTeacher).to.have.property('licensePathUrl');
//             });
//           });
//           context('viewing other', () => {
//             it('should find the teacher and return an restricted view', async () => {
//               const findByIdTeacher = await getTeacher();
//               expect(findByIdTeacher).to.not.have.property('licensePathUrl');
//             });
//           });
//         });
//         context('as an admin', () => {
//           it('should find the teacher and return an unrestricted view', async () => {
//             dbServiceAccessOptions.currentAPIUserRole = 'admin';
//             const findByIdTeacher = await getTeacher();
//             expect(findByIdTeacher).to.have.property('licensePathUrl');
//           });
//         });
//       });
//     });
//     context('db access denied', () => {
//       it('should throw an error', async () => {
//         dbServiceAccessOptions.isCurrentAPIUserPermitted = false;
//         try {
//           const findByIdTeacher = await teacherDbService.findById({
//             _id: fakeTeacher.teacherData!._id,
//             dbServiceAccessOptions,
//           });
//         } catch (err) {
//           expect(err.message).to.equal('Access denied.');
//         }
//       });
//     });
//   });
//   describe('insert', () => {
//     it('should throw an error', async () => {
//       dbServiceAccessOptions.isCurrentAPIUserPermitted = false;
//       const { ...modelToInsert } = fakeTeacher.teacherData;
//       try {
//         await teacherDbService.insert({
//           modelToInsert,
//           dbServiceAccessOptions,
//         });
//       } catch (err) {
//         expect(err).to.be.an('error');
//       }
//     });
//   });
//   describe('update', () => {
//     const updateTeacher = async () => {
//       const updatedTeacher = await teacherDbService.findOneAndUpdate({
//         searchQuery: { _id: fakeTeacher.teacherData!._id },
//         updateQuery: { studentCount: 5 },
//         dbServiceAccessOptions,
//         dbDependencyUpdateParams: {
//           updatedDependentSearchQuery: {
//             _id: fakeTeacher.teacherData!._id,
//           },
//         },
//       });
//       const findAppointment = await appointmentDbService.findOne({
//         searchQuery: {
//           hostedById: fakeTeacher._id,
//         },
//         dbServiceAccessOptions,
//       });
//       expect(updatedTeacher).to.not.deep.equal(fakeTeacher);
//       expect(updatedTeacher.studentCount).to.equal(5);
//       expect(
//         findAppointment.packageTransactionData.hostedByData.teacherData!.studentCount
//       ).to.equal(5);
//       return updatedTeacher;
//     };
//     context('db access permitted', () => {
//       context('invalid inputs', () => {
//         it('should return the original teacher if update field does not exist', async () => {
//           const updatedTeacher = await teacherDbService.findOneAndUpdate({
//             searchQuery: {
//               _id: fakeTeacher.teacherData!._id,
//             },
//             updateQuery: {
//               nonExistentField: 'some non-existent field',
//             },
//             dbServiceAccessOptions,
//           });
//           expect(updatedTeacher).to.deep.equal(fakeTeacher.teacherData);
//           return updatedTeacher;
//         });
//         it('should return null if the teacher to update does not exist', async () => {
//           const updatedTeacher = await teacherDbService.findOneAndUpdate({
//             searchQuery: {
//               _id: fakeTeacher.teacherData!.packages[0]._id,
//             },
//             updateQuery: { studentCount: 5 },
//             dbServiceAccessOptions,
//           });
//           expect(updatedTeacher).to.equal(null);
//         });
//       });
//       context('valid inputs', () => {
//         context('as a non-admin user', () => {
//           context('updating self', () => {
//             it('should update the teacher', async () => {
//               dbServiceAccessOptions.isSelf = true;
//               const updatedTeacher = await updateTeacher();
//               expect(updatedTeacher).to.have.property('licensePathUrl');
//             });
//           });
//           context('updating other', async () => {
//             it('should update the teacher', async () => {
//               const updatedTeacher = await updateTeacher();
//               expect(updatedTeacher).to.not.have.property('licensePathUrl');
//             });
//           });
//         });
//         context('as an admin', async () => {
//           it('should update the teacher', async () => {
//             dbServiceAccessOptions.currentAPIUserRole = 'admin';
//             const updatedTeacher = await updateTeacher();
//             expect(updatedTeacher).to.have.property('licensePathUrl');
//           });
//         });
//       });
//     });
//     context('db access denied', () => {
//       it('should throw an error', async () => {
//         dbServiceAccessOptions.isCurrentAPIUserPermitted = false;
//         try {
//           await updateTeacher();
//         } catch (err) {
//           expect(err.message).to.equal('Access denied.');
//         }
//       });
//     });
//   });
//   describe('delete', () => {
//     const deleteTeacher = async () => {
//       const foundUserBefore = await userDbService.findById({
//         _id: fakeTeacher._id,
//         dbServiceAccessOptions,
//       });
//       const deletedTeacher = await teacherDbService.findByIdAndDelete({
//         _id: fakeTeacher.teacherData!._id,
//         dbServiceAccessOptions,
//       });
//       const foundTeacher = await teacherDbService.findById({
//         _id: fakeTeacher.teacherData!._id,
//         dbServiceAccessOptions,
//       });
//       const foundUser = await userDbService.findById({
//         _id: fakeTeacher._id,
//         dbServiceAccessOptions,
//       });
//       expect(deletedTeacher).to.not.deep.equal(foundTeacher);
//       expect(foundTeacher).to.be.equal(null);
//       expect(foundUser).to.not.equal(null);
//     };
//     context('db access permitted', () => {
//       context('invalid inputs', () => {
//         it('should return null if the teacher to delete does not exist', async () => {
//           const deletedTeacher = await teacherDbService.findByIdAndDelete({
//             _id: fakeTeacher.teacherData!.packages[0]._id,
//             dbServiceAccessOptions,
//           });
//           expect(deletedTeacher).to.equal(null);
//         });
//       });
//       context('valid inputs', () => {
//         context('as a non-admin user', () => {
//           context('deleting self', () => {
//             it('should update the package', async () => {
//               dbServiceAccessOptions.isSelf = true;
//               await deleteTeacher();
//             });
//           });
//           context('deleting other', async () => {
//             it('should update the package', async () => {
//               await deleteTeacher();
//             });
//           });
//         });
//         context('as an admin', async () => {
//           it('should update the package', async () => {
//             dbServiceAccessOptions.currentAPIUserRole = 'admin';
//             await deleteTeacher();
//           });
//         });
//       });
//     });
//     context('db access denied', () => {
//       it('should throw an error', async () => {
//         dbServiceAccessOptions.isCurrentAPIUserPermitted = false;
//         try {
//           await deleteTeacher();
//         } catch (err) {
//           expect(err.message).to.equal('Access denied.');
//         }
//       });
//     });
//   });
// });
