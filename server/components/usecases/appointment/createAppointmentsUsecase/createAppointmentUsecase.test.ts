// import { expect } from 'chai';
// import { RouteData } from '../../abstractions/IUsecase';
// import { makeControllerDataBuilder } from '../../testFixtures/controllerDataBuilder';
// import { ControllerDataBuilder } from '../../testFixtures/controllerDataBuilder/controllerDataBuilder';
// import { makeCreateAppointmentsUsecase } from '.';
// import {
//   CreateAppointmentsUsecase,
//   CreateAppointmentsUsecaseResponse,
// } from './createAppointmentsUsecase';
// import { CurrentAPIUser } from '../../../webFrameworkCallbacks/abstractions/IHttpRequest';
// import { FakeDbPackageTransactionFactory } from '../../../dataAccess/testFixtures/fakeDbPackageTransactionFactory/fakeDbPackageTransactionFactory';
// import { makeFakeDbPackageTransactionFactory } from '../../../dataAccess/testFixtures/fakeDbPackageTransactionFactory';
// import { PackageTransactionDoc } from '../../../../models/PackageTransaction';
// import { FakeDbAvailableTimeFactory } from '../../../dataAccess/testFixtures/fakeDbAvailableTimeFactory/fakeDbAvailableTimeFactory';
// import { makeFakeDbAvailableTimeFactory } from '../../../dataAccess/testFixtures/fakeDbAvailableTimeFactory';
// import { AvailableTimeDoc } from '../../../../models/AvailableTime';
// import dayjs from 'dayjs';
// import { AvailableTimeDbService } from '../../../dataAccess/services/availableTime/availableTimeDbService';
// import { makeAvailableTimeDbService } from '../../../dataAccess/services/availableTime';

// let controllerDataBuilder: ControllerDataBuilder;
// let fakeDbPackageTransactionFactory: FakeDbPackageTransactionFactory;
// let fakeDbAvailableTimeFactory: FakeDbAvailableTimeFactory;
// let createAppointmentsUsecase: CreateAppointmentsUsecase;
// let routeData: RouteData;
// let fakePackageTransaction: PackageTransactionDoc;
// let fakeAvailableTime: AvailableTimeDoc;
// let currentAPIUser: CurrentAPIUser;
// let availableTimeDbService: AvailableTimeDbService;

// before(async () => {
//   controllerDataBuilder = makeControllerDataBuilder;
//   createAppointmentsUsecase = await makeCreateAppointmentsUsecase;
//   fakeDbPackageTransactionFactory = await makeFakeDbPackageTransactionFactory;
//   fakeDbAvailableTimeFactory = await makeFakeDbAvailableTimeFactory;
//   availableTimeDbService = await makeAvailableTimeDbService;
// });

// beforeEach(async () => {
//   fakePackageTransaction = await fakeDbPackageTransactionFactory.createFakeDbData();
//   fakeAvailableTime = await fakeDbAvailableTimeFactory.createFakeDbData({
//     hostedById: fakePackageTransaction.hostedById,
//     startDate: dayjs().toDate(),
//     endDate: dayjs().add(3, 'hour').toDate(),
//   });
//   currentAPIUser = {
//     userId: fakePackageTransaction.reservedById,
//     role: 'user',
//   };
//   routeData = {
//     params: {},
//     body: {
//       appointments: [
//         {
//           hostedById: fakePackageTransaction.hostedById,
//           reservedById: fakePackageTransaction.reservedById,
//           packageTransactionId: fakePackageTransaction._id,
//           startDate: fakeAvailableTime.startDate,
//           endDate: fakeAvailableTime.endDate,
//         },
//       ],
//     },
//     query: {},
//     endpointPath: '',
//   };
// });

// describe('createAppointmentUsecase', () => {
//   describe('makeRequest', () => {
//     const createAppointment = async () => {
//       const controllerData = controllerDataBuilder
//         .routeData(routeData)
//         .currentAPIUser(currentAPIUser)
//         .build();
//       const createAppointmentRes = await createAppointmentsUsecase.makeRequest(controllerData);
//       return createAppointmentRes;
//     };
//     context('db access permitted', () => {
//       context('invalid inputs', () => {
//         it('should throw an error if restricted fields found in body', async () => {
//           const routeDataBody = routeData.body;
//           routeDataBody.hostedById = 'some id';
//           routeDataBody.createdDate = new Date();
//           try {
//             await createAppointment();
//           } catch (err) {
//             expect(err).to.be.an('error');
//           }
//         });
//         it('should throw an error if there is an appointment overlap', async () => {
//           try {
//             await createAppointment();
//             await createAppointment();
//           } catch (err) {
//             expect(err).to.be.an('error');
//           }
//         });
//         it('should throw an error if body contains an hostedById other than the currentAPIUser id', async () => {
//           try {
//             routeData.body.hostedById = '507f1f77bcf86cd799439011';
//             await createAppointment();
//           } catch (err) {
//             expect(err).to.be.an('error');
//           }
//         });
//         it('should throw an error if body contains an foreign keys that do not exist', async () => {
//           try {
//             routeData.body.hostedById = '507f1f77bcf86cd799439011';
//             routeData.body.reservedById = '507f1f77bcf86cd799439011';
//             routeData.body.packageTransactionId = '507f1f77bcf86cd799439011';
//             await createAppointment();
//           } catch (err) {
//             expect(err).to.be.an('error');
//           }
//         });
//       });
//       context('valid inputs', () => {
//         const validResOutput = (createAppointmentRes: CreateAppointmentsUsecaseResponse) => {
//           const appointments = createAppointmentRes.appointments;
//           const appointment = createAppointmentRes.appointments[0];
//           expect(appointments.length).to.equal(1);
//           expect(appointment).to.have.property('hostedById');
//           expect(appointment).to.have.property('startDate');
//           expect(appointment).to.have.property('endDate');
//           expect(appointment).to.have.property('packageTransactionData');
//         };
//         it('should return a new appointment', async () => {
//           const createAppointmentRes = await createAppointment();
//           //   validResOutput(createAppointmentRes);
//         });
//         context('should split up available times', () => {
//           context("appointment startTime is the same as availableTime's startTime", () => {
//             it('should split the availableTime so that starts at the end of the appointment', async () => {});
//           });
//           context(
//             "appointment startTime and endTime is not the same as availableTime's startTime and endTime",
//             () => {
//               it('should split the availableTime so that there is one before the appointment and one after', async () => {});
//             }
//           );
//           context("appointment endTime is the same as availableTime's endTime", () => {
//             it('should split the availableTime so that it ends at the start of the appointment', async () => {});
//           });
//         });
//       });
//     });
//   });
// });
