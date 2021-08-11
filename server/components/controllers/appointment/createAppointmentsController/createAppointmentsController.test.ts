// import { expect } from 'chai';
// import { IHttpRequestBuilder } from '../../testFixtures/iHttpRequestBuilder/iHttpRequestBuilder';
// import { makeIHttpRequestBuilder } from '../../testFixtures/iHttpRequestBuilder';
// import { makeFakeDbPackageTransactionFactory } from '../../../dataAccess/testFixtures/fakeDbPackageTransactionFactory';
// import { FakeDbPackageTransactionFactory } from '../../../dataAccess/testFixtures/fakeDbPackageTransactionFactory/fakeDbPackageTransactionFactory';
// import { FakeDbAvailableTimeFactory } from '../../../dataAccess/testFixtures/fakeDbAvailableTimeFactory/fakeDbAvailableTimeFactory';
// import { makeFakeDbAvailableTimeFactory } from '../../../dataAccess/testFixtures/fakeDbAvailableTimeFactory';
// import { PackageTransactionDoc } from '../../../../models/PackageTransaction';
// import dayjs from 'dayjs';
// import { CurrentAPIUser } from '../../../webFrameworkCallbacks/abstractions/IHttpRequest';
// import { CreateAppointmentsController } from './createAppointmentsController';
// import { makeCreateAppointmentsController } from '.';
// import { AvailableTimeDoc } from '../../../../models/AvailableTime';
// import { AvailableTimeDbService } from '../../../dataAccess/services/availableTime/availableTimeDbService';
// import { makeAvailableTimeDbService } from '../../../dataAccess/services/availableTime';

// let iHttpRequestBuilder: IHttpRequestBuilder;
// let fakeDbPackageTransactionFactory: FakeDbPackageTransactionFactory;
// let fakeDbAvailableTimeFactory: FakeDbAvailableTimeFactory;
// let availableTimeDbService: AvailableTimeDbService;
// let fakePackageTransaction: PackageTransactionDoc;
// let fakeAvailableTime: AvailableTimeDoc;
// let currentAPIUser: CurrentAPIUser;
// let body: StringKeyObject;
// let createAppointmentsController: CreateAppointmentsController;

// before(async () => {
//   iHttpRequestBuilder = makeIHttpRequestBuilder;
//   fakeDbPackageTransactionFactory = await makeFakeDbPackageTransactionFactory;
//   fakeDbAvailableTimeFactory = await makeFakeDbAvailableTimeFactory;
//   availableTimeDbService = await makeAvailableTimeDbService;
//   createAppointmentsController = await makeCreateAppointmentsController;
// });

// beforeEach(async () => {
//   fakePackageTransaction = await fakeDbPackageTransactionFactory.createFakeDbData();
//   fakeAvailableTime = await fakeDbAvailableTimeFactory.createFakeDbData({
//     hostedById: fakePackageTransaction.hostedById,
//     startDate: dayjs().toDate(),
//     endDate: dayjs().add(3, 'hour').toDate(),
//   });
//   body = {
//     appointments: [
//       {
//         hostedById: fakePackageTransaction.hostedById,
//         reservedById: fakePackageTransaction.reservedById,
//         packageTransactionId: fakePackageTransaction._id,
//         startDate: fakeAvailableTime.startDate,
//         endDate: dayjs(fakeAvailableTime.startDate).add(1, 'hour').toDate(),
//       },
//     ],
//   };
//   currentAPIUser = {
//     userId: fakePackageTransaction.reservedById,
//     role: 'user',
//   };
// });

// describe('createAppointmentsTimeController', () => {
//   describe('makeRequest', () => {
//     const createAppointments = async () => {
//       const createAppointmentsHttpRequest = iHttpRequestBuilder
//         .body(body)
//         .currentAPIUser(currentAPIUser)
//         .build();
//       const createAppointments = await createAppointmentsController.makeRequest(
//         createAppointmentsHttpRequest
//       );
//       return createAppointments;
//     };
//     context('valid inputs', () => {
//       it('should create a new appointment', async () => {
//         const createAppointmentsRes = await createAppointments();
//         console.log(createAppointmentsRes, 'here');
//         expect(createAppointmentsRes.statusCode).to.equal(201);
//         if ('appointments' in createAppointmentsRes.body) {
//           expect(createAppointmentsRes.body.appointments[0].hostedById).to.deep.equal(
//             fakePackageTransaction.hostedById
//           );
//         }
//       });
//     });
//     // context('invalid inputs', () => {
//     //   it('should throw an error if user input is invalid', async () => {
//     //     const createAvailableTimeHttpRequest = iHttpRequestBuilder
//     //       .body({})
//     //       .currentAPIUser(currentAPIUser)
//     //       .build();
//     //     const createAvailableTime = await createAvailableTimeController.makeRequest(
//     //       createAvailableTimeHttpRequest
//     //     );
//     //     expect(createAvailableTime.statusCode).to.equal(500);
//     //   });
//     //   it('should throw an error if the user is not logged in', async () => {
//     //     const createAvailableTimeHttpRequest = iHttpRequestBuilder
//     //       .body({})
//     //       .currentAPIUser({
//     //         role: 'user',
//     //       })
//     //       .build();
//     //     const createAvailableTime = await createAvailableTimeController.makeRequest(
//     //       createAvailableTimeHttpRequest
//     //     );
//     //     expect(createAvailableTime.statusCode).to.equal(500);
//     //   });
//     // });
//   });
// });
