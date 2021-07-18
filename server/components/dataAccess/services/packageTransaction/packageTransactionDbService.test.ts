// import { expect } from 'chai';
// import { makePackageTransactionDbService } from '.';
// import { AppointmentDoc } from '../../../../models/Appointment';
// import { PackageTransactionDoc } from '../../../../models/PackageTransaction';
// import { DbServiceAccessOptions } from '../../abstractions/IDbService';
// import { makeFakeDbAppointmentFactory } from '../../testFixtures/fakeDbAppointmentFactory';
// import { FakeDbAppointmentFactory } from '../../testFixtures/fakeDbAppointmentFactory/fakeDbAppointmentFactory';
// import { makeFakeDbPackageTransactionFactory } from '../../testFixtures/fakeDbPackageTransactionFactory';
// import { FakeDbPackageTransactionFactory } from '../../testFixtures/fakeDbPackageTransactionFactory/fakeDbPackageTransactionFactory';
// import { makeFakeDbUserFactory } from '../../testFixtures/fakeDbUserFactory';
// import { FakeDbUserFactory } from '../../testFixtures/fakeDbUserFactory/fakeDbUserFactory';
// import { makeAppointmentDbService } from '../appointment';
// import { AppointmentDbService } from '../appointment/appointmentDbService';
// import { PackageTransactionDbService } from './packageTransactionDbService';

// let packageTransactionDbService: PackageTransactionDbService;
// let appointmentDbService: AppointmentDbService;
// let dbServiceAccessOptions: DbServiceAccessOptions;
// let fakeDbPackageTransactionFactory: FakeDbPackageTransactionFactory;
// let fakeDbUserFactory: FakeDbUserFactory;
// let fakeDbAppointmentFactory: FakeDbAppointmentFactory;
// let fakePackageTransaction: PackageTransactionDoc;
// let fakeAppointment: AppointmentDoc;

// before(async () => {
//   packageTransactionDbService = await makePackageTransactionDbService;
//   appointmentDbService = await makeAppointmentDbService;
//   fakeDbPackageTransactionFactory = await makeFakeDbPackageTransactionFactory;
//   dbServiceAccessOptions = fakeDbPackageTransactionFactory.getDbServiceAccessOptions();
//   fakeDbUserFactory = await makeFakeDbUserFactory;
//   fakeDbAppointmentFactory = await makeFakeDbAppointmentFactory;
// });

// beforeEach(async () => {
//   fakePackageTransaction = await fakeDbPackageTransactionFactory.createFakeDbData();
//   fakeAppointment = await fakeDbAppointmentFactory.createFakeDbData({
//     hostedById: fakePackageTransaction.hostedById.toString(),
//     reservedById: fakePackageTransaction.reservedById.toString(),
//     packageTransactionId: fakePackageTransaction._id.toString(),
//     startTime: new Date(),
//     endTime: new Date(),
//   });
// });

// describe('packageTransactionDbService', () => {
//   describe('findById, findOne, find', () => {
//     context('db access permitted', () => {
//       context('invalid inputs', () => {
//         it('should throw an error if given an invalid id', async () => {
//           try {
//             await packageTransactionDbService.findById({
//               _id: undefined,
//               dbServiceAccessOptions,
//             });
//           } catch (err) {
//             expect(err).be.an('error');
//           }
//         });
//         it('should return null if given an non-existent id', async () => {
//           const findByIdPackageTransaction = await packageTransactionDbService.findById({
//             _id: '60979db0bb31ed001589a1ea',
//             dbServiceAccessOptions,
//           });
//           expect(findByIdPackageTransaction).to.equal(null);
//         });
//       });
//       context('valid inputs', () => {
//         const getPackageTransaction = async () => {
//           const findParams = {
//             searchQuery: {
//               hostedById: fakePackageTransaction.hostedById,
//             },
//             dbServiceAccessOptions,
//           };
//           const findByIdPackageTransaction = await packageTransactionDbService.findById({
//             _id: fakePackageTransaction._id,
//             dbServiceAccessOptions,
//           });
//           const findOnePackageTransaction = await packageTransactionDbService.findOne(findParams);
//           const findPackageTransactions = await packageTransactionDbService.find(findParams);
//           expect(findByIdPackageTransaction).to.deep.equal(findOnePackageTransaction);
//           expect(findByIdPackageTransaction).to.deep.equal(findPackageTransactions[0]);
//           expect(findByIdPackageTransaction.hostedByData).to.not.have.property('password');
//           expect(findByIdPackageTransaction.hostedByData).to.not.have.property('email');
//           expect(findByIdPackageTransaction.hostedByData).to.not.have.property('settings');
//           expect(findByIdPackageTransaction.hostedByData).to.not.have.property('commMethods');
//           expect(findByIdPackageTransaction.reservedByData).to.not.have.property('password');
//           expect(findByIdPackageTransaction.reservedByData).to.not.have.property('email');
//           expect(findByIdPackageTransaction.reservedByData).to.not.have.property('settings');
//           expect(findByIdPackageTransaction.reservedByData).to.not.have.property('commMethods');
//         };
//         context('as a non-admin user', () => {
//           context('viewing self', () => {
//             it('should find the packageTransaction and return an restricted view on some data', async () => {
//               dbServiceAccessOptions.isSelf = true;
//               await getPackageTransaction();
//             });
//           });
//           context('viewing other', () => {
//             it('should find the packageTransaction and return an restricted view on some data', async () => {
//               await getPackageTransaction();
//             });
//           });
//         });
//         context('as an admin', () => {
//           it('should find the packageTransaction and return an restricted view on some data', async () => {
//             await getPackageTransaction();
//           });
//         });
//       });
//     });
//     context('db access denied', () => {
//       it('should throw an error', async () => {
//         dbServiceAccessOptions.isCurrentAPIUserPermitted = false;
//         try {
//           const findByIdPackageTransaction = await packageTransactionDbService.findById({
//             _id: fakePackageTransaction._id,
//             dbServiceAccessOptions,
//           });
//         } catch (err) {
//           expect(err).to.be.an('error');
//         }
//       });
//     });
//   });
//   describe('insert', () => {
//     context('db access permitted', () => {
//       context('invalid inputs', () => {
//         it('should throw an error if required fields are not given', async () => {
//           try {
//             fakePackageTransaction = await packageTransactionDbService.insert({
//               modelToInsert: {},
//               dbServiceAccessOptions,
//             });
//           } catch (err) {
//             expect(err).to.be.an('error');
//           }
//         });
//       });
//       context('valid inputs', () => {
//         it('should insert a packageTransaction', async () => {
//           const findByIdPackageTransaction = await packageTransactionDbService.findById({
//             _id: fakePackageTransaction._id,
//             dbServiceAccessOptions,
//           });
//           expect(findByIdPackageTransaction).to.not.equal(null);
//           expect(findByIdPackageTransaction).to.deep.equal(fakePackageTransaction);
//         });
//       });
//     });
//     context('db access denied', () => {
//       it('should throw an error', async () => {
//         dbServiceAccessOptions.isCurrentAPIUserPermitted = false;
//         const { _id, ...modelToInsert } = fakePackageTransaction;
//         try {
//           fakePackageTransaction = await packageTransactionDbService.insert({
//             modelToInsert,
//             dbServiceAccessOptions,
//           });
//         } catch (err) {
//           expect(err.message).to.equal('Access denied.');
//         }
//       });
//     });
//   });
//   describe('update', () => {
//     const updatePackageTransaction = async () => {
//       const updatedPackageTransaction = await packageTransactionDbService.findOneAndUpdate({
//         searchQuery: { _id: fakePackageTransaction._id },
//         updateParams: { lessonLanguage: 'en' },
//         dbServiceAccessOptions,
//         dbDependencyUpdateParams: {
//           updatedDependentSearchQuery: {
//             _id: fakePackageTransaction._id,
//           },
//         },
//       });
//       const updatedAppointment = await appointmentDbService.findOne({
//         searchQuery: { packageTransactionId: updatedPackageTransaction._id },
//         dbServiceAccessOptions,
//       });
//       expect(updatedPackageTransaction).to.not.deep.equal(fakePackageTransaction);
//       expect(updatedPackageTransaction.lessonLanguage).to.equal('en');
//       expect(updatedAppointment.packageTransactionData.lessonLanguage).to.equal('en');
//     };
//     context('db access permitted', () => {
//       context('invalid inputs', () => {
//         it('should return the original packageTransaction if update field does not exist', async () => {
//           const updatedPackageTransaction = await packageTransactionDbService.findOneAndUpdate({
//             searchQuery: {
//               hostedById: fakePackageTransaction.hostedById,
//             },
//             updateParams: {
//               nonExistentField: 'some non-existent field',
//             },
//             dbServiceAccessOptions,
//           });
//           expect(updatedPackageTransaction).to.deep.equal(fakePackageTransaction);
//         });
//         it('should return null if the packageTransaction to update does not exist', async () => {
//           const updatedPackageTransaction = await packageTransactionDbService.findOneAndUpdate({
//             searchQuery: {
//               _id: fakePackageTransaction.hostedById,
//             },
//             updateParams: { lessonLanguage: 'en' },
//             dbServiceAccessOptions,
//           });
//           expect(updatedPackageTransaction).to.equal(null);
//         });
//       });
//       context('valid inputs', () => {
//         context('as a non-admin user', () => {
//           context('updating self', () => {
//             it('should update the packageTransaction', async () => {
//               dbServiceAccessOptions.isSelf = true;
//               await updatePackageTransaction();
//             });
//           });
//           context('updating other', async () => {
//             it('should update the packageTransaction', async () => {
//               await updatePackageTransaction();
//             });
//           });
//         });
//         context('as an admin', async () => {
//           it('should update the packageTransaction', async () => {
//             dbServiceAccessOptions.currentAPIUserRole = 'admin';
//             await updatePackageTransaction();
//           });
//         });
//       });
//     });
//     context('db access denied', () => {
//       it('should throw an error', async () => {
//         dbServiceAccessOptions.isCurrentAPIUserPermitted = false;
//         try {
//           await updatePackageTransaction();
//         } catch (err) {
//           expect(err.message).to.equal('Access denied.');
//         }
//       });
//     });
//   });

//   describe('delete', () => {
//     const deletePackageTransaction = async () => {
//       const deletedPackage = await packageTransactionDbService.findByIdAndDelete({
//         _id: fakePackageTransaction._id,
//         dbServiceAccessOptions,
//       });
//       const foundPackage = await packageTransactionDbService.findById({
//         _id: fakePackageTransaction._id,
//         dbServiceAccessOptions,
//       });
//       expect(foundPackage).to.not.deep.equal(deletedPackage);
//       expect(foundPackage).to.be.equal(null);
//     };
//     context('db access permitted', () => {
//       context('invalid inputs', () => {
//         it('should return null if the packageTransaction to delete does not exist', async () => {
//           const deletedPackage = await packageTransactionDbService.findByIdAndDelete({
//             _id: fakePackageTransaction.hostedById,
//             dbServiceAccessOptions,
//           });
//           expect(deletedPackage).to.equal(null);
//         });
//       });
//       context('valid inputs', () => {
//         context('as a non-admin user', () => {
//           context('deleting self', () => {
//             it('should update the packageTransaction', async () => {
//               dbServiceAccessOptions.isSelf = true;
//               await deletePackageTransaction();
//             });
//           });
//           context('deleting other', async () => {
//             it('should update the packageTransaction', async () => {
//               await deletePackageTransaction();
//             });
//           });
//         });
//         context('as an admin', async () => {
//           it('should update the packageTransaction', async () => {
//             dbServiceAccessOptions.currentAPIUserRole = 'admin';
//             await deletePackageTransaction();
//           });
//         });
//       });
//     });
//     context('db access denied', () => {
//       it('should throw an error', async () => {
//         dbServiceAccessOptions.isCurrentAPIUserPermitted = false;
//         try {
//           await deletePackageTransaction();
//         } catch (err) {
//           expect(err.message).to.equal('Access denied.');
//         }
//       });
//     });
//   });
// });
