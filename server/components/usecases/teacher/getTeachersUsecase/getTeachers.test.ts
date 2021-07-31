// import { expect } from 'chai';
// import { JoinedUserDoc } from '../../../../models/User';
// import { makeFakeDbUserFactory } from '../../../dataAccess/testFixtures/fakeDbUserFactory';
// import { FakeDbUserFactory } from '../../../dataAccess/testFixtures/fakeDbUserFactory/fakeDbUserFactory';
// import { PACKAGE_ENTITY_NAME } from '../../../entities/package/packageEntity';
// import { CurrentAPIUser } from '../../../webFrameworkCallbacks/abstractions/IHttpRequest';
// import { RouteData } from '../../abstractions/IUsecase';
// import { makeControllerDataBuilder } from '../../testFixtures/controllerDataBuilder';
// import { ControllerDataBuilder } from '../../testFixtures/controllerDataBuilder/controllerDataBuilder';

// before(async () => {});

// beforeEach(async () => {});

// let getTeachersUsecase: GetTeachersUsecase;
// let fakeDbUserFactory: FakeDbUserFactory;
// let controllerDataBuilder: ControllerDataBuilder;
// let fakeUser: JoinedUserDoc;
// let fakeTeacher: JoinedUserDoc;
// let routeData: RouteData;
// let currentAPIUser: CurrentAPIUser;
// let endpointPath: string;

// before(async () => {
//   getTeachersUsecase = await makeGetTeachersUsecase;
//   fakeDbUserFactory = await makeFakeDbUserFactory;
//   controllerDataBuilder = makeControllerDataBuilder;
// });

// beforeEach(async () => {
//   fakeUser = await fakeDbUserFactory.createFakeDbUser();
//   fakeTeacher = await fakeDbUserFactory.createFakeDbTeacherWithDefaultPackages();
//   routeData = {
//     params: {},
//     body: {},
//     query: {
//       teachingLanguages: ['ja'],
//       alsoSpeaks: ['en'],
//       teacherType: ['licensed'],
//       maxPrice: 40,
//       minPrice: 30,
//       teacherTags: [],
//       packageTags: [],
//       lessonDurations: [],
//       packageName: PACKAGE_ENTITY_NAME.LIGHT,
//       contactMethodName: ['Skype', 'LINE'],
//       contactMethodType: ['online', 'offline'],
//     },
//   };
//   currentAPIUser = {
//     userId: fakeTeacher._id,
//     role: fakeTeacher.role,
//   };
//   endpointPath = '';
// });

// describe('getTeachersUsecase', () => {
//   describe('makeRequest', () => {
//     const getTeachers = async () => {
//       const controllerData = controllerDataBuilder
//         .currentAPIUser(currentAPIUser)
//         .routeData(routeData)
//         .endpointPath(endpointPath)
//         .build();
//       const getTeachersRes = await getTeachersUsecase.makeRequest(controllerData);
//       const savedDbTeachers = getTeachersRes.teachers;
//       return savedDbTeachers;
//     };

//     const testUserViews = (savedDbTeachers: JoinedUserDoc[]) => {
//       for (const teacher of savedDbTeachers) {
//         expect(teacher).to.not.have.property('email');
//         expect(teacher).to.not.have.property('settings');
//         expect(teacher).to.not.have.property('contactMethods');
//         expect(teacher.teacherData).to.not.have.property('licensePathUrl');
//         expect(teacher).to.not.have.property('password');
//         expect(teacher).to.not.have.property('verificationToken');
//       }
//     };

//     context('db access permitted', () => {
//       context('invalid inputs', () => {
//         it('should throw an error if no user is found', async () => {
//           try {
//             routeData.params = '60979db0bb31ed001589a1ea';
//             await getTeachers();
//           } catch (err) {
//             expect(err.message).to.equal('Resource not found.');
//           }
//         });
//         it('should throw an error if an invalid id is given', async () => {
//           try {
//             routeData.params = 'undefined';
//             await getTeachers();
//           } catch (err) {
//             expect(err).to.be.an('error');
//           }
//         });
//       });
//       context('valid inputs', () => {
//         context('as a non-admin user', () => {
//           context('viewing self', () => {
//             it('should get the teachers and return a less restricted view', async () => {
//               const savedDbTeachers = await getTeachers();
//               testUserViews(savedDbTeachers);
//             });
//           });
//           context('viewing other', () => {
//             it('should get the teachers and return a restricted view', async () => {
//               currentAPIUser.userId = fakeUser._id;
//               const savedDbTeachers = await getTeachers();
//               testUserViews(savedDbTeachers);
//             });
//           });
//         });
//         context('as an admin', () => {
//           context('viewing other', () => {
//             it('should get the teachers and return a less restricted view', async () => {
//               currentAPIUser.userId = fakeTeacher._id;
//               currentAPIUser.role = 'admin';
//               const savedDbTeachers = await getTeachers();
//               testUserViews(savedDbTeachers);
//             });
//           });
//         });
//         context('as an unlogged-in user', async () => {
//           it('should get the teachers and return a restricted view', async () => {
//             currentAPIUser = { role: 'user', userId: undefined };
//             const savedDbTeachers = await getTeachers();
//             testUserViews(savedDbTeachers);
//           });
//         });
//       });
//     });
//   });
// });
