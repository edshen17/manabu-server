// import { expect } from 'chai';
// import { FakeDbUserFactory } from '../../../dataAccess/testFixtures/fakeDbUserFactory/fakeDbUserFactory';
// import { makeFakeDbUserFactory } from '../../../dataAccess/testFixtures/fakeDbUserFactory';
// import { ControllerDataBuilder } from '../../testFixtures/controllerDataBuilder/controllerDataBuilder';
// import { EditUserUsecase } from './editUserUsecase';
// import { makeEditUserUsecase } from '.';
// import { makeControllerDataBuilder } from '../../testFixtures/controllerDataBuilder';
// import { RouteData } from '../../abstractions/IUsecase';
// import { JoinedUserDoc } from '../../../../models/User';
// import { CurrentAPIUser } from '../../../webFrameworkCallbacks/abstractions/IHttpRequest';

// let fakeDbUserFactory: FakeDbUserFactory;
// let controllerDataBuilder: ControllerDataBuilder;
// let editUserUsecase: EditUserUsecase;
// let routeData: RouteData;
// let currentAPIUser: CurrentAPIUser;
// let fakeTeacher: JoinedUserDoc;

// before(async () => {
//   editUserUsecase = await makeEditUserUsecase;
//   fakeDbUserFactory = await makeFakeDbUserFactory;
//   controllerDataBuilder = makeControllerDataBuilder;
//   fakeTeacher = await fakeDbUserFactory.createFakeDbTeacherWithDefaultPackages();
// });

// beforeEach(() => {
//   routeData = {
//     params: {
//       uId: fakeTeacher._id.toString(),
//     },
//     body: {},
//     query: {},
//   };
//   currentAPIUser = {
//     userId: fakeTeacher._id.toString(),
//     role: fakeTeacher.role,
//   };
// });

// describe('editUserUsecase', () => {
//   describe('makeRequest', () => {
//     const editUser = async () => {
//       const controllerData = controllerDataBuilder
//         .currentAPIUser(currentAPIUser)
//         .routeData(routeData)
//         .build();
//       const updateUserRes = await editUserUsecase.makeRequest(controllerData);
//       const updatedUser = updateUserRes.user;
//       return updatedUser;
//     };
//     const testUserViews = (savedDbUser: JoinedUserDoc) => {
//       expect(savedDbUser).to.have.property('email');
//       expect(savedDbUser).to.have.property('settings');
//       expect(savedDbUser).to.have.property('contactMethods');
//       expect(savedDbUser.teacherData).to.have.property('licensePathUrl');
//       expect(savedDbUser).to.not.have.property('password');
//       expect(savedDbUser).to.not.have.property('verificationToken');
//     };
//     context('db access permitted', () => {
//       context('invalid inputs', () => {
//         it('should throw an error if restricted fields found in body', async () => {
//           routeData.body = {
//             _id: 'some id',
//             role: 'admin',
//             dateRegistered: new Date(),
//             verificationToken: 'new token',
//           };
//           try {
//             await editUser();
//           } catch (err) {
//             expect(err.message).to.equal('Access denied.');
//           }
//         });
//         it('should throw if no inputs are provided', async () => {
//           try {
//             await editUser();
//           } catch (err) {
//             expect(err).to.be.an('error');
//           }
//         });
//       });
//       context('valid inputs', () => {
//         context('as a non-admin user', () => {
//           context('updating self', () => {
//             it('should update the user and return a restricted view', async () => {
//               expect(fakeTeacher.profileBio).to.equal('');
//               routeData.body = {
//                 profileBio: 'new profile bio',
//               };

//               const updatedUser = await editUser();
//               expect(updatedUser.profileBio).to.equal('new profile bio');
//               testUserViews(updatedUser);
//             });
//           });
//         });
//         context('as an admin', () => {
//           context('updating other', () => {
//             it('should update the user and return a less restricted view', async () => {
//               const updaterUser = fakeTeacher;
//               const updateeUser = await fakeDbUserFactory.createFakeDbTeacherWithDefaultPackages();
//               const { body, params } = routeData;
//               expect(updateeUser.profileBio).to.equal('');
//               body.profileBio = 'new profile bio';
//               params.uId = updateeUser._id.toString();
//               currentAPIUser.userId = updaterUser._id.toString();
//               currentAPIUser.role = 'admin';
//               const updatedUser = await editUser();
//               expect(updatedUser.profileBio).to.equal('new profile bio');
//               testUserViews(updatedUser);
//             });
//           });
//         });
//       });
//     });
//     context('db access denied', () => {
//       it('should throw an error when updating another user', async () => {
//         const updaterUser = fakeTeacher;
//         const updateeUser = await fakeDbUserFactory.createFakeDbTeacherWithDefaultPackages();
//         const { body, params } = routeData;
//         body.profileBio = 'new profile bio';
//         params.uId = updateeUser._id.toString();
//         currentAPIUser.userId = updaterUser._id.toString();
//         try {
//           const updatedUser = await editUser();
//         } catch (err) {
//           expect(err.message).to.equal('Access denied.');
//         }
//       });
//     });
//   });
// });
