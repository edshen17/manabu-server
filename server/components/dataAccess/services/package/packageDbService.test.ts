import { expect } from 'chai';
import { makePackageDbService } from '.';
import { PackageDoc } from '../../../../models/Package';
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
let fakePackage: PackageDoc;

before(async () => {
  packageDbService = await makePackageDbService;
  fakeDbPackageFactory = await makeFakeDbPackageFactory;
  fakeDbUserFactory = await makeFakeDbUserFactory;
});

beforeEach(async () => {
  dbServiceAccessOptions = fakeDbPackageFactory.getDbServiceAccessOptions();
  fakeTeacher = await fakeDbUserFactory.createFakeDbTeacherWithDefaultPackages();
  fakePackage = await fakeDbPackageFactory.createFakeDbData({
    hostedById: fakeTeacher._id.toString(),
    lessonAmount: 5,
    packageType: 'default',
    packageName: 'light',
    isOffering: true,
    lessonDurations: [30, 60],
  });
});

describe('packageDbService', () => {
  describe('findById, findOne, find', () => {
    context('db access permitted', () => {
      context('invalid inputs', () => {
        it('should throw an error if given an invalid id', async () => {
          try {
            await packageDbService.findById({
              _id: undefined,
              dbServiceAccessOptions,
            });
          } catch (err) {
            expect(err).be.an('error');
          }
        });
        it('should return null if given an non-existent id', async () => {
          const findByIdPackage = await packageDbService.findById({
            _id: '60979db0bb31ed001589a1ea',
            dbServiceAccessOptions,
          });
          expect(findByIdPackage).to.equal(null);
        });
      });
      context('valid inputs', () => {
        const getPackage = async () => {
          const findParams = {
            searchQuery: {
              _id: fakePackage._id,
            },
            dbServiceAccessOptions,
          };
          const findByIdPackage = await packageDbService.findById({
            _id: fakePackage._id,
            dbServiceAccessOptions,
          });
          const findOnePackage = await packageDbService.findOne(findParams);
          const findPackages = await packageDbService.find(findParams);
          expect(findByIdPackage).to.deep.equal(findOnePackage);
          expect(findByIdPackage).to.deep.equal(findPackages[0]);
        };
        context('as a non-admin user', () => {
          context('viewing self', () => {
            it('should find the package and return an unrestricted view', async () => {
              dbServiceAccessOptions.isSelf = true;
              await getPackage();
            });
          });
          context('viewing other', () => {
            it('should find the package and return an unrestricted view', async () => {
              await getPackage();
            });
          });
        });
        context('as an admin', () => {
          it('should find the package and return an unrestricted view', async () => {
            dbServiceAccessOptions.isSelf = true;
            await getPackage();
          });
        });
      });
    });
    context('db access denied', () => {
      it('should throw an error', async () => {
        dbServiceAccessOptions.isCurrentAPIUserPermitted = false;
        try {
          const findByIdPackage = await packageDbService.findById({
            _id: fakeTeacher._id,
            dbServiceAccessOptions,
          });
        } catch (err) {
          expect(err).to.be.an('error');
        }
      });
    });
  });
  describe('insert', () => {
    context('db access permitted', () => {
      context('invalid inputs', () => {
        it('should throw an error if required fields are not given', async () => {
          try {
            const fakePackage = await packageDbService.insert({
              modelToInsert: {},
              dbServiceAccessOptions,
            });
          } catch (err) {
            expect(err).to.be.an('error');
          }
        });
      });
      context('valid inputs', () => {
        it('should insert a new package', async () => {
          const findPackage = await packageDbService.findById({
            _id: fakePackage._id,
            dbServiceAccessOptions,
          });
          expect(fakePackage).to.not.equal(null);
          expect(findPackage).to.deep.equal(fakePackage);
        });
      });
    });
    context('db access denied', () => {
      it('should throw an error', async () => {
        dbServiceAccessOptions.isCurrentAPIUserPermitted = false;
        const { _id, ...modelToInsert } = fakePackage;
        try {
          fakePackage = await packageDbService.insert({
            modelToInsert,
            dbServiceAccessOptions,
          });
        } catch (err) {
          expect(err.message).to.equal('Access denied.');
        }
      });
    });
  });
  describe('update', () => {
    const updatePackage = async () => {
      const updatedPackage = await packageDbService.findOneAndUpdate({
        searchQuery: { _id: fakePackage._id },
        updateParams: { packageType: 'custom' },
        dbServiceAccessOptions,
      });
      expect(updatedPackage).to.not.deep.equal(fakePackage);
      expect(updatedPackage.packageType).to.equal('custom');
    };
    context('db access permitted', () => {
      context('invalid inputs', () => {
        it('should return the original package if update field does not exist', async () => {
          const updatedPackage = await packageDbService.findOneAndUpdate({
            searchQuery: { _id: fakePackage._id },
            updateParams: {
              nonExistentField: 'some non-existent field',
            },
            dbServiceAccessOptions,
          });
          expect(updatedPackage).to.deep.equal(fakePackage);
        });
        it('should return null if the package to update does not exist', async () => {
          const updatedPackage = await packageDbService.findOneAndUpdate({
            searchQuery: {
              _id: fakePackage.hostedById,
            },
            updateParams: { packageType: 'custom' },
            dbServiceAccessOptions,
          });
          expect(updatedPackage).to.equal(null);
        });
      });
      context('valid inputs', () => {
        context('as a non-admin user', () => {
          context('updating self', () => {
            it('should update the package', async () => {
              dbServiceAccessOptions.isSelf = true;
              await updatePackage();
            });
          });
          context('updating other', async () => {
            it('should update the package', async () => {
              await updatePackage();
            });
          });
        });
        context('as an admin', async () => {
          it('should update the package', async () => {
            dbServiceAccessOptions.currentAPIUserRole = 'admin';
            await updatePackage();
          });
        });
      });
    });
    context('db access denied', () => {
      it('should throw an error', async () => {
        dbServiceAccessOptions.isCurrentAPIUserPermitted = false;
        try {
          await updatePackage();
        } catch (err) {
          expect(err.message).to.equal('Access denied.');
        }
      });
    });
  });
  describe('delete', () => {
    const deletePackage = async () => {
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
    };
    context('db access permitted', () => {
      context('invalid inputs', () => {
        it('should return null if the package to delete does not exist', async () => {
          const deletedPackage = await packageDbService.findByIdAndDelete({
            _id: fakePackage.hostedById,
            dbServiceAccessOptions,
          });
          expect(deletedPackage).to.equal(null);
        });
      });
      context('valid inputs', () => {
        context('as a non-admin user', () => {
          context('deleting self', () => {
            it('should update the package', async () => {
              dbServiceAccessOptions.isSelf = true;
              await deletePackage();
            });
          });
          context('deleting other', async () => {
            it('should update the package', async () => {
              await deletePackage();
            });
          });
        });
        context('as an admin', async () => {
          it('should update the package', async () => {
            dbServiceAccessOptions.currentAPIUserRole = 'admin';
            await deletePackage();
          });
        });
      });
    });
    context('db access denied', () => {
      it('should throw an error', async () => {
        dbServiceAccessOptions.isCurrentAPIUserPermitted = false;
        try {
          await deletePackage();
        } catch (err) {
          expect(err.message).to.equal('Access denied.');
        }
      });
    });
  });
});
