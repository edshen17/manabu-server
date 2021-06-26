import { expect } from 'chai';
import { makePackageTransactionDbService } from '.';
import { PackageTransactionDoc } from '../../../../models/PackageTransaction';
import { AccessOptions } from '../../abstractions/IDbOperations';
import { makeFakeDbPackageTransactionFactory } from '../../testFixtures/fakeDbPackageTransactionFactory';
import { FakeDbPackageTransactionFactory } from '../../testFixtures/fakeDbPackageTransactionFactory/fakeDbPackageTransactionFactory';
import { makeFakeDbUserFactory } from '../../testFixtures/fakeDbUserFactory';
import { FakeDbUserFactory } from '../../testFixtures/fakeDbUserFactory/fakeDbUserFactory';
import { JoinedUserDoc } from '../user/userDbService';
import { PackageTransactionDbService } from './packageTransactionDbService';

let packageTransactionDbService: PackageTransactionDbService;
let fakeDbPackageTransactionFactory: FakeDbPackageTransactionFactory;
let fakeDbUserFactory: FakeDbUserFactory;
let fakeTeacher: JoinedUserDoc;
let accessOptions: AccessOptions;
let fakePackageTransaction: PackageTransactionDoc;

before(async () => {
  packageTransactionDbService = await makePackageTransactionDbService;
  fakeDbPackageTransactionFactory = await makeFakeDbPackageTransactionFactory;
  fakeDbUserFactory = await makeFakeDbUserFactory;
  fakeTeacher = await fakeDbUserFactory.createFakeDbTeacherWithDefaultPackages();
  accessOptions = fakeDbPackageTransactionFactory.getDefaultAccessOptions();
});

beforeEach(async () => {
  fakePackageTransaction = await fakeDbPackageTransactionFactory.createFakeDbData();
});

describe('packageTransactionDbService', () => {
  describe('findById, findOne, find', () => {
    it('should find a package from the given search query', async () => {
      const findByIdPackageTransaction = await packageTransactionDbService.findById({
        _id: fakePackageTransaction._id,
        accessOptions,
      });
      const findOnePackageTransaction = await packageTransactionDbService.findOne({
        searchQuery: { _id: fakePackageTransaction._id },
        accessOptions,
      });
      const findPackageTransactions = await packageTransactionDbService.find({
        searchQuery: { _id: fakePackageTransaction._id },
        accessOptions,
      });
      expect(findByIdPackageTransaction).to.deep.equal(fakePackageTransaction);
      expect(findByIdPackageTransaction).to.deep.equal(findOnePackageTransaction);
      expect(findByIdPackageTransaction).to.deep.equal(findPackageTransactions[0]);
    });
  });
  describe('insert', async () => {
    it('should insert a new packageTransaction', async () => {
      expect(fakePackageTransaction).to.not.equal(null);
    });
  });
  describe('update', () => {
    it('should update the packageTransaction', async () => {
      expect(fakePackageTransaction.remainingAppointments).to.not.equal(0);
      const updatedPackageTransaction = await packageTransactionDbService.findOneAndUpdate({
        searchQuery: { _id: fakePackageTransaction._id },
        updateParams: { remainingAppointments: 0 },
        accessOptions,
      });
      expect(updatedPackageTransaction.remainingAppointments).to.equal(0);
    });
  });
  describe('delete', async () => {
    it('should delete the packageTransaction', async () => {
      const deletedPackageTransaction = await packageTransactionDbService.findByIdAndDelete({
        _id: fakePackageTransaction._id,
        accessOptions,
      });
      const foundPackageTransaction = await packageTransactionDbService.findById({
        _id: fakePackageTransaction._id,
        accessOptions,
      });
      expect(foundPackageTransaction).to.not.deep.equal(deletedPackageTransaction);
      expect(foundPackageTransaction).to.be.equal(null);
    });
  });
});
