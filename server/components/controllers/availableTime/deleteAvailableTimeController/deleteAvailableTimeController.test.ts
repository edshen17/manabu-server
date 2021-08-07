// import { expect } from 'chai';
// import { makeIHttpRequestBuilder } from '../../testFixtures/IHttpRequestBuilder';
// import { IHttpRequestBuilder } from '../../testFixtures/IHttpRequestBuilder/IHttpRequestBuilder';
// import { DeleteAvailableTimeController } from './deleteAvailableTimeController';
// import { makeDeleteAvailableTimeController } from '.';
// import { RouteData } from '../../../usecases/abstractions/IUsecase';
// import { FakeDbAvailableTimeFactory } from '../../../dataAccess/testFixtures/fakeDbAvailableTimeFactory/fakeDbAvailableTimeFactory';
// import { makeFakeDbAvailableTimeFactory } from '../../../dataAccess/testFixtures/fakeDbAvailableTimeFactory';
// import { AvailableTimeDoc } from '../../../../models/AvailableTime';

// let iHttpRequestBuilder: IHttpRequestBuilder;
// let deleteAvailableTimeController: DeleteAvailableTimeController;
// let fakeDbAvailableTimeFactory: FakeDbAvailableTimeFactory;
// let fakeAvailableTime: AvailableTimeDoc;
// let routeData: RouteData;

// before(async () => {
//   iHttpRequestBuilder = makeIHttpRequestBuilder;
//   deleteAvailableTimeController = await makeDeleteAvailableTimeController;
//   fakeDbAvailableTimeFactory = await makeFakeDbAvailableTimeFactory;
//   fakeAvailableTime = await fakeDbAvailableTimeFactory.createFakeDbData();
// });

// beforeEach(async () => {
//   routeData = {
//     query: {},
//     params: {},
//     body: {
//       _id: fakeAvailableTime._id,
//     },
//     endpointPath: '',
//   };
// });

// describe('deleteAvailableTimeController', () => {
//   describe('makeRequest', () => {
//     context('valid inputs', () => {
//       it('should create a new available time document', async () => {
//         const createAvailableTimeHttpRequest = iHttpRequestBuilder
//           .body(body)
//           .currentAPIUser({
//             userId: fakeTeacher._id,
//             teacherId: fakeTeacher.teacherData!._id,
//             role: fakeTeacher.role,
//           })
//           .build();
//         const createAvailableTime = await deleteAvailableTimeController.makeRequest(
//           createAvailableTimeHttpRequest
//         );
//         expect(createAvailableTime.statusCode).to.equal(201);
//         if ('availableTime' in createAvailableTime.body) {
//           expect(createAvailableTime.body.availableTime.hostedById).to.deep.equal(fakeTeacher._id);
//         }
//       });
//     });
//     context('invalid inputs', () => {
//       it('should throw an error if user input is invalid', async () => {
//         const createAvailableTimeHttpRequest = iHttpRequestBuilder
//           .body({})
//           .currentAPIUser({
//             userId: fakeTeacher._id,
//             teacherId: fakeTeacher.teacherData!._id,
//             role: fakeTeacher.role,
//           })
//           .build();
//         const createAvailableTime = await deleteAvailableTimeController.makeRequest(
//           createAvailableTimeHttpRequest
//         );
//         expect(createAvailableTime.statusCode).to.equal(500);
//       });
//       it('should throw an error if the user is not logged in', async () => {
//         const createAvailableTimeHttpRequest = iHttpRequestBuilder
//           .body({})
//           .currentAPIUser({
//             role: 'user',
//           })
//           .build();
//         const createAvailableTime = await deleteAvailableTimeController.makeRequest(
//           createAvailableTimeHttpRequest
//         );
//         expect(createAvailableTime.statusCode).to.equal(500);
//       });
//     });
//   });
// });
