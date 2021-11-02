// import { expect } from 'chai';
// import dayjs from 'dayjs';
// import { JoinedUserDoc } from '../../../../models/User';
// import { makeFakeDbUserFactory } from '../../../dataAccess/testFixtures/fakeDbUserFactory';
// import { FakeDbUserFactory } from '../../../dataAccess/testFixtures/fakeDbUserFactory/fakeDbUserFactory';
// import { CurrentAPIUser } from '../../../webFrameworkCallbacks/abstractions/IHttpRequest';
// import { RouteData } from '../../abstractions/IUsecase';
// import { makeControllerDataBuilder } from '../../utils/controllerDataBuilder';
// import { ControllerDataBuilder } from '../../utils/controllerDataBuilder/controllerDataBuilder';
// import { CreateStripeWebhookUsecase } from './createStripeWebhookUsecase';

// let controllerDataBuilder: ControllerDataBuilder;
// let fakeDbUserFactory: FakeDbUserFactory;
// let createStripeWebhookUsecase: CreateStripeWebhookUsecase;
// let routeData: RouteData;
// let fakeUser: JoinedUserDoc;
// let currentAPIUser: CurrentAPIUser;

// before(async () => {
//   controllerDataBuilder = makeControllerDataBuilder;
//   createStripeWebhookUsecase = await makeCreateStripeWebhookUsecase;
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
//       startDate: dayjs().minute(1).toDate(),
//       endDate: dayjs().minute(2).toDate(),
//     },
//     query: {},
//     endpointPath: '',
//     headers: {},
//   };
// });

// describe('createStripeWebhookUsecase', () => {
//   describe('makeRequest', () => {
//     const createStripeWebhook = async () => {
//       const controllerData = controllerDataBuilder
//         .routeData(routeData)
//         .currentAPIUser(currentAPIUser)
//         .build();
//       const createStripeWebhookRes = await createStripeWebhookUsecase.makeRequest(controllerData);
//       return createStripeWebhookRes;
//     };
//     const testStripeWebhookError = async () => {
//       let error;
//       try {
//         error = await createStripeWebhook();
//       } catch (err) {
//         return;
//       }
//       expect(error).to.be.an('error');
//     };
//     context('packageTransaction', () => {
//       context('successful payment', () => {
//         const validResOutput = (createStripeWebhookRes: CreateStripeWebhookResponse) => {
//           const packageTransaction = createStripeWebhookRes.packageTransaction;
//           expect(packageTransaction).to.have.property('_id');
//           expect(packageTransaction).to.have.property('hostedById');
//           expect(packageTransaction).to.have.property('reservedById');
//         };
//         it('should return a new packageTransaction', async () => {
//           const createStripeWebhookRes = await createStripeWebhook();
//           validResOutput(createStripeWebhookRes);
//         });
//       });
//     });
//   });
// });
