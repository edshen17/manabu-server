// import { expect } from 'chai';
// import { makeCreatePackageTransactionUsecase } from '.';
// import { JoinedUserDoc } from '../../../../models/User';
// import { makeFakeDbUserFactory } from '../../../dataAccess/testFixtures/fakeDbUserFactory';
// import { FakeDbUserFactory } from '../../../dataAccess/testFixtures/fakeDbUserFactory/fakeDbUserFactory';
// import { CurrentAPIUser } from '../../../webFrameworkCallbacks/abstractions/IHttpRequest';
// import { RouteData } from '../../abstractions/IUsecase';
// import { makeCreatePackageTransactionCheckoutUsecase } from '../../checkout/packageTransaction/createPackageTransactionCheckoutUsecase';
// import { CreatePackageTransactionCheckoutUsecase } from '../../checkout/packageTransaction/createPackageTransactionCheckoutUsecase/createPackageTransactionCheckoutUsecase';
// import { makeControllerDataBuilder } from '../../utils/controllerDataBuilder';
// import { ControllerDataBuilder } from '../../utils/controllerDataBuilder/controllerDataBuilder';
// import {
//   CreatePackageTransactionUsecase,
//   CreatePackageTransactionUsecaseResponse,
// } from './createPackageTransactionUsecase';

// let controllerDataBuilder: ControllerDataBuilder;
// let fakeDbUserFactory: FakeDbUserFactory;
// let fakeTeacher: JoinedUserDoc;
// let createPackageTransactionUsecase: CreatePackageTransactionUsecase;
// let createPackageTransactionCheckoutUsecase: CreatePackageTransactionCheckoutUsecase;
// let createPackageTransactionUsecaseRouteData: RouteData;
// let createPackageTransactionCheckoutRouteData: RouteData;
// let fakeUser: JoinedUserDoc;
// let currentAPIUser: CurrentAPIUser;

// before(async () => {
//   controllerDataBuilder = makeControllerDataBuilder;
//   createPackageTransactionUsecase = await makeCreatePackageTransactionUsecase;
//   createPackageTransactionCheckoutUsecase = await makeCreatePackageTransactionCheckoutUsecase;
//   fakeDbUserFactory = await makeFakeDbUserFactory;
// });

// beforeEach(async () => {
//   fakeUser = await fakeDbUserFactory.createFakeDbUser();
//   fakeTeacher = await fakeDbUserFactory.createFakeDbTeacher();
//   currentAPIUser = {
//     userId: fakeUser._id,
//     role: fakeUser.role,
//   };
//   createPackageTransactionCheckoutRouteData = {
//     headers: {},
//     params: {},
//     body: {
//       teacherId: fakeTeacher.teacherData!._id,
//       packageId: fakeTeacher.teacherData!.packages[0]._id,
//       lessonDuration: 60,
//       lessonLanguage: 'ja',
//     },
//     query: {
//       paymentGateway: 'paypal',
//     },
//     endpointPath: '',
//   };
//   createPackageTransactionUsecaseRouteData = {
//     params: {},
//     body: {},
//     query: {
//       token: fakeUser._id.toString(),
//     },
//     endpointPath: '',
//     headers: {},
//   };
// });

// describe('createPackageTransactionUsecase', () => {
//   describe('makeRequest', () => {
//     const createPackageTransaction = async () => {
//       const createPackageTransactionCheckoutControllerData = controllerDataBuilder
//         .routeData(createPackageTransactionUsecaseRouteData)
//         .currentAPIUser(currentAPIUser)
//         .build();
//       await createPackageTransactionCheckoutUsecase.makeRequest(
//         createPackageTransactionCheckoutControllerData
//       );
//       const createPackageTransactionControllerData = controllerDataBuilder
//         .routeData(createPackageTransactionUsecaseRouteData)
//         .currentAPIUser(currentAPIUser)
//         .build();
//       const createPackageTransactionRes = await createPackageTransactionUsecase.makeRequest(
//         createPackageTransactionControllerData
//       );
//       return createPackageTransactionRes;
//     };
//     const testPackageTransactionError = async () => {
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
//         it('should throw an error if invalid token', async () => {
//           createPackageTransactionUsecaseRouteData.query.token = 'bad token';
//           await testPackageTransactionError();
//         });
//         it('should throw an error if token has been used more than once', async () => {
//           await createPackageTransaction();
//           await testPackageTransactionError();
//         });
//       });
//       context('valid inputs', () => {
//         const validResOutput = (
//           createPackageTransactionRes: CreatePackageTransactionUsecaseResponse
//         ) => {
//           const packageTransaction = createPackageTransactionRes.packageTransaction;
//           expect(packageTransaction).to.have.property('hostedById');
//           expect(packageTransaction).to.have.property('reservedById');
//           expect(packageTransaction).to.have.property('packageId');
//         };
//         it('should return a new packageTransaction', async () => {
//           const createPackageTransactionRes = await createPackageTransaction();
//           validResOutput(createPackageTransactionRes);
//         });
//       });
//     });
//   });
// });
