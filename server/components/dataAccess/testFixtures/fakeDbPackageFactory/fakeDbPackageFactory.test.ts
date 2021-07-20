import { expect } from 'chai';
import { makeFakeDbPackageFactory } from '.';
import { JoinedUserDoc } from '../../../../models/User';
import { makePackageDbService } from '../../services/package';
import { PackageDbService } from '../../services/package/packageDbService';
import { makeFakeDbUserFactory } from '../fakeDbUserFactory';
import { FakeDbUserFactory } from '../fakeDbUserFactory/fakeDbUserFactory';
import { FakeDbPackageFactory } from './fakeDbPackageFactory';

let packageDbService: PackageDbService;
let fakeDbUserFactory: FakeDbUserFactory;
let fakeDbPackageFactory: FakeDbPackageFactory;
let fakeTeacher: JoinedUserDoc;

before(async () => {
  packageDbService = await makePackageDbService;
  fakeDbUserFactory = await makeFakeDbUserFactory;
  fakeDbPackageFactory = await makeFakeDbPackageFactory;
});

beforeEach(async () => {
  fakeTeacher = await fakeDbUserFactory.createFakeDbTeacherWithDefaultPackages();
});

describe('fakeDbPackageFactory', () => {
  describe('createFakeDbData', () => {
    it('should create 3 fake db packages', async () => {
      const fakePackages = await fakeDbPackageFactory.createFakePackages();
      expect(fakePackages.length).to.equal(3);
    });
  });
});
