// import { expect } from 'chai';
// import { makeFakeDbPackageFactory } from '.';
// import { JoinedUserDoc } from '../../../../models/User';
// import { makePackageDbService } from '../../services/package';
// import { PackageDbService } from '../../services/package/packageDbService';
// import { makeFakeDbUserFactory } from '../fakeDbUserFactory';
// import { FakeDbUserFactory } from '../fakeDbUserFactory/fakeDbUserFactory';
// import { FakeDbPackageFactory } from './fakeDbPackageFactory';

// let packageDbService: PackageDbService;
// let fakeDbUserFactory: FakeDbUserFactory;
// let fakeDbPackageFactory: FakeDbPackageFactory;
// let fakeTeacher: JoinedUserDoc;

// before(async () => {
//   packageDbService = await makePackageDbService;
//   fakeDbUserFactory = await makeFakeDbUserFactory;
//   fakeDbPackageFactory = await makeFakeDbPackageFactory;
// });

// beforeEach(async () => {
//   fakeTeacher = await fakeDbUserFactory.createFakeDbTeacherWithDefaultPackages();
// });

// describe('fakeDbPackageFactory', () => {
//   describe('createFakeDbData', () => {
//     it('should create 3 fake db packages that belong to a given user', async () => {
//       const fakePackages = await fakeDbPackageFactory.createFakePackages();
//       expect(fakePackages.length).to.equal(3);
//     });
//     it('should create a fake db package that belong to a given user', async () => {
//       const fakePackage = await fakeDbPackageFactory.createFakeDbData({
//         lessonAmount: 5,
//         packageName: 'light',
//         packageType: 'default',
//         isOffering: true,
//         lessonDurations: [30, 60],
//       });
//       expect(fakePackage.packageType).to.equal('default');
//     });
//   });
// });
