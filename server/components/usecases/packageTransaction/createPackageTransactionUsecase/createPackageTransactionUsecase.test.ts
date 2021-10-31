// import { expect } from 'chai';
// import { JoinedUserDoc } from '../../../../models/User';
// import { StringKeyObject } from '../../../../types/custom';
// import { makeCacheDbService } from '../../../dataAccess/services/cache';
// import { CacheDbService, TTL_MS } from '../../../dataAccess/services/cache/cacheDbService';
// import { makeFakeDbUserFactory } from '../../../dataAccess/testFixtures/fakeDbUserFactory';
// import { FakeDbUserFactory } from '../../../dataAccess/testFixtures/fakeDbUserFactory/fakeDbUserFactory';
// import { CurrentAPIUser } from '../../../webFrameworkCallbacks/abstractions/IHttpRequest';
// import { RouteData } from '../../abstractions/IUsecase';
// import { makeControllerDataBuilder } from '../../utils/controllerDataBuilder';
// import { ControllerDataBuilder } from '../../utils/controllerDataBuilder/controllerDataBuilder';
// import { makeJwtHandler } from '../../utils/jwtHandler';
// import { JwtHandler } from '../../utils/jwtHandler/jwtHandler';

// let controllerDataBuilder: ControllerDataBuilder;
// let fakeDbUserFactory: FakeDbUserFactory;
// let fakeTeacher: JoinedUserDoc;
// let jwtHandler: JwtHandler;
// let createPackageTransactionUsecase: CreatePackageTransactionUsecase;
// let cacheDbService: CacheDbService;
// let routeData: RouteData;
// let fakeUser: JoinedUserDoc;
// let currentAPIUser: CurrentAPIUser;
// let toTokenObj: StringKeyObject;

// before(async () => {
//   controllerDataBuilder = makeControllerDataBuilder;
//   createPackageTransactionUsecase = await makeCreatePackageTransactionUsecase;
//   fakeDbUserFactory = await makeFakeDbUserFactory;
//   jwtHandler = await makeJwtHandler;
//   cacheDbService = await makeCacheDbService;
// });

// beforeEach(async () => {
//   fakeUser = await fakeDbUserFactory.createFakeDbUser();
//   fakeTeacher = await fakeDbUserFactory.createFakeDbTeacher();
//   currentAPIUser = {
//     userId: fakeUser._id,
//     role: fakeUser.role,
//   };
//   const userIdToken = fakeUser._id.toString();
//   routeData = {
//     params: {},
//     body: {},
//     query: {
//       token: userIdToken,
//     },
//     endpointPath: '',
//     headers: {},
//   };
//   toTokenObj = {
//     teacherId: fakeTeacher.teacherData!._id,
//     packageId: fakeTeacher.teacherData!.packages[0]._id,
//     lessonDuration: 60,
//     lessonLanguage: 'ja',
//     lessonAmount: 5,
//   };
//   const jwt = jwtHandler.sign({
//     toTokenObj: { toTokenObj, resourceName: 'packageTransaction' },
//     expiresIn: '1d',
//   });
//   await cacheDbService.set({
//     hashKey: 'usercheckouttoken',
//     key: userIdToken,
//     value: jwt,
//     ttlMs: TTL_MS.DAY,
//   });
// });

// describe('createPackageTransactionUsecase', () => {
//   describe('makeRequest', () => {
//     const createPackageTransaction = async () => {
//       const controllerData = controllerDataBuilder
//         .routeData(routeData)
//         .currentAPIUser(currentAPIUser)
//         .build();
//       const createPackageTransactionRes = await createPackageTransactionUsecase.makeRequest(
//         controllerData
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
//           routeData.query.token = 'bad token';
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
