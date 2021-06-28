// import { expect } from 'chai';
// import { AccessOptions } from '../../abstractions/IDbOperations';
// import { makeFakeDbAppointmentFactory } from '../../testFixtures/fakeDbAppointmentFactory';
// import { FakeDbAppointmentFactory } from '../../testFixtures/fakeDbAppointmentFactory/fakeDbAppointmentFactory';

// let appointmentDbService: AppointmentDbService;
// let fakeDbAppointmentFactory: FakeDbAppointmentFactory;
// let accessOptions: AccessOptions;

// before(async () => {
//   appointmentDbService = makeAppointmentDbService;
//   fakeDbAppointmentFactory = makeFakeDbAppointmentFactory;
// });

// before(() => {
//   accessOptions = fakeDbAppointmentFactory.getDefaultAccessOptions();
// });

// describe('appointmentDbService', () => {
//   describe('findById, findOne, find', () => {
//     it('should find the correct appointment in the db', async () => {
//       const fakePackageTransaction = await fakeDbPackageTransactionFactory.createFakeDbData();
//       const fakeAppointment = await fakeDbAppointmentFactory.createFakeDbData({
//         hostedBy: fakePackageTransaction.hostedBy,
//         reservedBy: fakePackageTransaction.reservedBy,
//         packageTransactionId: fakePackageTransaction._id,
//         from: new Date(),
//         to: new Date(),
//       });
//       const findAppointment = appointmentDbService.find({ searchQuery: })
//     });
//   });
//   describe('update', () => {
//     it('', () => {});
//   });
// });
