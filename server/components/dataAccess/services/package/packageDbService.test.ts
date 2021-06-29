import { expect } from 'chai';
import { makePackageDbService } from '.';
import { DbServiceAccessOptions } from '../../abstractions/IDbService';
import { makeFakeDbPackageFactory } from '../../testFixtures/fakeDbPackageFactory';
import { FakeDbPackageFactory } from '../../testFixtures/fakeDbPackageFactory/fakeDbPackageFactory';
import { makeFakeDbUserFactory } from '../../testFixtures/fakeDbUserFactory';
import { FakeDbUserFactory } from '../../testFixtures/fakeDbUserFactory/fakeDbUserFactory';
import { JoinedUserDoc } from '../user/userDbService';
import { PackageDbService } from './packageDbService';

let packageDbService: PackageDbService;
let fakeDbPackageFactory: FakeDbPackageFactory;
let fakeDbUserFactory: FakeDbUserFactory;
let fakeTeacher: JoinedUserDoc;
let dbServiceAccessOptions: DbServiceAccessOptions;

before(async () => {
  packageDbService = await makePackageDbService;
  fakeDbPackageFactory = await makeFakeDbPackageFactory;
  fakeDbUserFactory = await makeFakeDbUserFactory;
  fakeTeacher = await fakeDbUserFactory.createFakeDbTeacherWithDefaultPackages();
  dbServiceAccessOptions = fakeDbPackageFactory.getDefaultAccessOptions();
});

describe('packageDbService', () => {
  describe('findById, findOne, find', () => {
    it('should find a package from the given search query', async () => {
      const fakePackages = fakeTeacher.teacherData.packages;
      const findByIdPackage = await packageDbService.findById({
        _id: fakePackages[0]._id,
        dbServiceAccessOptions,
      });
      const findOnePackage = await packageDbService.findOne({
        searchQuery: { _id: fakePackages[0]._id },
        dbServiceAccessOptions,
      });
      const findPackages = await packageDbService.find({
        searchQuery: { hostedBy: fakeTeacher._id },
        dbServiceAccessOptions,
      });
      expect(findByIdPackage._id.toString()).to.deep.equal(fakePackages[0]._id.toString());
      expect(findByIdPackage._id.toString()).to.deep.equal(findOnePackage._id.toString());
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
        dbServiceAccessOptions,
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
        dbServiceAccessOptions,
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
        dbServiceAccessOptions,
      });
      const foundPackage = await packageDbService.findById({
        _id: fakePackage._id,
        dbServiceAccessOptions,
      });
      expect(foundPackage).to.not.deep.equal(deletedPackage);
      expect(foundPackage).to.be.equal(null);
    });
  });
});
