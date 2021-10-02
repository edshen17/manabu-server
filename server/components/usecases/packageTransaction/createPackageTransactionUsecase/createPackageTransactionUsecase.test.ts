// import { expect } from 'chai';
// import { makeCreateAvailableTimeUsecase } from '.';
// import { JoinedUserDoc } from '../../../../models/User';
// import { makeFakeDbUserFactory } from '../../../dataAccess/testFixtures/fakeDbUserFactory';
// import { FakeDbUserFactory } from '../../../dataAccess/testFixtures/fakeDbUserFactory/fakeDbUserFactory';
// import { CurrentAPIUser } from '../../../webFrameworkCallbacks/abstractions/IHttpRequest';
// import { RouteData } from '../../abstractions/IUsecase';
// import { makeControllerDataBuilder } from '../../utils/controllerDataBuilder';
// import { ControllerDataBuilder } from '../../utils/controllerDataBuilder/controllerDataBuilder';

// let controllerDataBuilder: ControllerDataBuilder;
// let fakeDbUserFactory: FakeDbUserFactory;
// let createPackageTransactionUsecase: CreatePackageTransactionUsecase;
// let routeData: RouteData;
// let fakeUser: JoinedUserDoc;
// let currentAPIUser: CurrentAPIUser;

// before(async () => {
//   controllerDataBuilder = makeControllerDataBuilder;
//   createPackageTransactionUsecase = await makeCreatePackageTransactionUsecase;
//   fakeDbUserFactory = await makeFakeDbUserFactory;
// });

// beforeEach(async () => {
//   fakeUser = await fakeDbUserFactory.createFakeDbUser();
//   currentAPIUser = {
//     userId: fakeUser._id,
//     role: fakeUser.role,
//   };
//   routeData = {
//     params: {},
//     body: {
//       hostedById: fakeUser._id,
//       startDate: new Date(),
//       endDate: new Date(),
//     },
//     query: {},
//     endpointPath: '',
//   };
// });

// describe('createPackageTransactionUsecase', () => {
//   describe('makeRequest', () => {
//     const createPackageTransaction = async () => {
//       const controllerData = controllerDataBuilder
//         .routeData(routeData)
//         .currentAPIUser(currentAPIUser)
//         .build();
//       const createAvailableTimeRes = await createAvailableTimeUsecase.makeRequest(controllerData);
//       return createAvailableTimeRes;
//     };
//     const testAvailableTimeError = async () => {
//       let error;
//       try {
//         error = await createPackageTransaction();
//       } catch (err) {
//         return;
//       }
//       expect(error).to.be.an('error');
//     };

//     context('db access permitted', () => {
//       context('invalid inputs', () => {
//         it('should throw an error if invalid data is passed', async () => {
//           const routeDataBody = routeData.body;
//           routeDataBody.hostedById = 'some id';
//           routeDataBody.createdDate = new Date();
//           await testAvailableTimeError();
//         });
//         it('should throw an error if there is an availableTime overlap', async () => {
//           let err;
//           try {
//             await createPackageTransaction();
//             err = await createPackageTransaction();
//           } catch (err) {
//             return;
//           }
//           expect(err).to.be.an('error');
//         });
//         it('should throw an error if body contains an hostedById other than the currentAPIUser id', async () => {
//           routeData.body.hostedById = '507f1f77bcf86cd799439011';
//           await testAvailableTimeError();
//         });
//       });
//       context('valid inputs', () => {
//         const validResOutput = (createAvailableTimeRes: CreateAvailableTimeUsecaseResponse) => {
//           const availableTime = createAvailableTimeRes.availableTime;
//           expect(availableTime).to.have.property('hostedById');
//           expect(availableTime).to.have.property('startDate');
//           expect(availableTime).to.have.property('endDate');
//         };
//         it('should return a new available time', async () => {
//           const createAvailableTimeRes = await createPackageTransaction();
//           validResOutput(createAvailableTimeRes);
//         });
//       });
//     });
//   });
// });
