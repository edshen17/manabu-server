import chai from 'chai';
import { makePackageDbService } from '.';
import { AccessOptions } from '../../abstractions/IDbOperations';
import { makeFakeDbPackageFactory } from '../../testFixtures/fakeDbPackageFactory';
import { FakeDbPackageFactory } from '../../testFixtures/fakeDbPackageFactory/fakeDbPackageFactory';
import { makeFakeDbUserFactory } from '../../testFixtures/fakeDbUserFactory';
import { FakeDbUserFactory } from '../../testFixtures/fakeDbUserFactory/fakeDbUserFactory';
import { JoinedUserDoc } from '../user/userDbService';
import { PackageDbService } from './packageDbService';

const expect = chai.expect;
let packageDbService: PackageDbService;
let fakeDbPackageFactory: FakeDbPackageFactory;
let fakeDbUserFactory: FakeDbUserFactory;
let fakeTeacher: JoinedUserDoc;
let accessOptions: AccessOptions;

before(async () => {
  packageDbService = await makePackageDbService;
  fakeDbPackageFactory = await makeFakeDbPackageFactory;
  fakeDbUserFactory = await makeFakeDbUserFactory;
  fakeTeacher = await fakeDbUserFactory.createFakeDbTeacherWithDefaultPackages();
  accessOptions = fakeDbPackageFactory.getDefaultAccessOptions();
});

describe('packageDbService', () => {
  describe('findById, findOne, find', () => {
    it('should find a package from the given search query', async () => {
      const fakePackages = fakeTeacher.teacherData.packages;
      const findByIdPackage = await packageDbService.findById({
        _id: fakePackages[0]._id,
        accessOptions,
      });
      const findOnePackage = await packageDbService.findOne({
        _id: fakePackages[0]._id,
        accessOptions,
      });
      const findPackages = await packageDbService.find({
        searchQuery: { hostedBy: fakeTeacher._id },
        accessOptions,
      });
      expect(findByIdPackage).to.deep.equal(fakePackages[0]);
      expect(findByIdPackage).to.deep.equal(findOnePackage);
      expect(findPackages).to.deep.equal(fakePackages);
    });
  });
  describe('insert', () => {
    it('should insert a package', async () => {
      const fakeUser = await fakeDbUserFactory.createFakeDbUser();
      const fakePackages = await fakeDbPackageFactory.createFakePackages({
        hostedBy: fakeUser._id,
      });
      const foundPackages = await packageDbService.find({
        searchQuery: { hostedBy: fakeUser._id },
        accessOptions,
      });
      expect(foundPackages.length).to.equal(fakePackages.length);
    });
  });
  describe('update', () => {
    it('should updated the given package', async () => {
      const fakePackage = fakeTeacher.teacherData.packages[0];
      const updatedPackage = await packageDbService.findOneAndUpdate({
        searchQuery: { _id: fakePackage._id },
        updateParams: { packageType: 'different', packageDurations: [90] },
        accessOptions,
      });
      expect(updatedPackage).to.not.deep.equal(fakePackage);
      expect(updatedPackage.packageType).to.equal('different');
      expect(updatedPackage.packageDurations).to.deep.equal([90]);
    });
  });
  describe('delete', () => {
    it('should delete the given package', async () => {
      const fakePackage = fakeTeacher.teacherData.packages[0];
      const deletedPackage = await packageDbService.findByIdAndDelete({
        _id: fakePackage._id,
        accessOptions,
      });
      const foundPackage = await packageDbService.findById({
        _id: fakePackage._id,
        accessOptions,
      });
      expect(foundPackage).to.not.deep.equal(deletedPackage);
      expect(foundPackage).to.be.equal(null);
    });
  });
});
