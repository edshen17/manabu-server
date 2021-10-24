// import { expect } from 'chai';
// import { JoinedUserDoc } from '../../../../../models/User';
// import { makeFakeDbUserFactory } from '../../../../dataAccess/testFixtures/fakeDbUserFactory';
// import { FakeDbUserFactory } from '../../../../dataAccess/testFixtures/fakeDbUserFactory/fakeDbUserFactory';
// import { CurrentAPIUser } from '../../../../webFrameworkCallbacks/abstractions/IHttpRequest';
// import { RouteData } from '../../../abstractions/IUsecase';
// import { makeControllerDataBuilder } from '../../../utils/controllerDataBuilder';
// import { ControllerDataBuilder } from '../../../utils/controllerDataBuilder/controllerDataBuilder';

// let controllerDataBuilder: ControllerDataBuilder;
// let fakeDbUserFactory: FakeDbUserFactory;
// let routeData: RouteData;
// let fakeUser: JoinedUserDoc;
// let currentAPIUser: CurrentAPIUser;

// before(async () => {
//   controllerDataBuilder = makeControllerDataBuilder;
//   createPackageTransactionCheckoutUsecase = await makeCreatePackageTransactionCheckoutUsecase;
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
//     body: {},
//     query: {
//       paymentGateway: 'paypal',
//     },
//     endpointPath: '',
//   };
// });

// describe('createPackageTransactionCheckoutUsecase', () => {
//   describe('makeRequest', () => {
//     const createPackageTransactionCheckout = async () => {
//       const controllerData = controllerDataBuilder
//         .routeData(routeData)
//         .currentAPIUser(currentAPIUser)
//         .build();
//       const createPackageTransactionCheckoutRes =
//         await createPackageTransactionCheckoutUsecase.makeRequest(controllerData);
//       return createPackageTransactionCheckoutRes;
//     };
//     const testPackageTransactionCheckoutError = async () => {
//       let error;
//       try {
//         error = await createPackageTransactionCheckout();
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
//           await testPackageTransactionCheckoutError();
//         });
//         it('should throw an error if body contains an invalid userId', async () => {
//           routeData.body.hostedById = 'bad id';
//           await testPackageTransactionCheckoutError();
//         });
//       });
//       context('valid inputs', () => {
//         const validResOutput = async () => {
//           const createPackageTransactionCheckoutRes = await createPackageTransactionCheckout();
//           expect(createPackageTransactionCheckoutRes).to.have.property('redirectUrl');
//         };
//         context('one-time payment', () => {
//           context('paypal', () => {
//             it('should get a valid paypal checkout link', async () => {
//               await validResOutput();
//             });
//           });
//           context('stripe', () => {
//             it('should get a valid paypal checkout link', async () => {
//               routeData.query.paymentGateway = 'stripe';
//               await validResOutput();
//             });
//           });
//         });
//       });
//     });
//   });
// });
