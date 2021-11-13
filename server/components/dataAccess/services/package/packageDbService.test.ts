import { expect } from 'chai';
import { makePackageDbService } from '.';
import { AppointmentDoc } from '../../../../models/Appointment';
import { PackageDoc } from '../../../../models/Package';
import { PackageTransactionDoc } from '../../../../models/PackageTransaction';
import { JoinedUserDoc } from '../../../../models/User';
import { DbServiceAccessOptions } from '../../abstractions/IDbService';
import { makeFakeDbAppointmentFactory } from '../../testFixtures/fakeDbAppointmentFactory';
import { FakeDbAppointmentFactory } from '../../testFixtures/fakeDbAppointmentFactory/fakeDbAppointmentFactory';
import { makeFakeDbPackageFactory } from '../../testFixtures/fakeDbPackageFactory';
import { FakeDbPackageFactory } from '../../testFixtures/fakeDbPackageFactory/fakeDbPackageFactory';
import { makeFakeDbPackageTransactionFactory } from '../../testFixtures/fakeDbPackageTransactionFactory';
import { FakeDbPackageTransactionFactory } from '../../testFixtures/fakeDbPackageTransactionFactory/fakeDbPackageTransactionFactory';
import { makeFakeDbUserFactory } from '../../testFixtures/fakeDbUserFactory';
import { FakeDbUserFactory } from '../../testFixtures/fakeDbUserFactory/fakeDbUserFactory';
import { makeAppointmentDbService } from '../appointment';
import { AppointmentDbService } from '../appointment/appointmentDbService';
import { makePackageTransactionDbService } from '../packageTransaction';
import { PackageTransactionDbService } from '../packageTransaction/packageTransactionDbService';
import { PackageDbService } from './packageDbService';

let packageDbService: PackageDbService;
let packageTransactionDbService: PackageTransactionDbService;
let appointmentDbService: AppointmentDbService;
let fakeDbPackageFactory: FakeDbPackageFactory;
let fakeDbUserFactory: FakeDbUserFactory;
let fakeDbPackageTransactionFactory: FakeDbPackageTransactionFactory;
let fakeDbAppointmentFactory: FakeDbAppointmentFactory;
let fakeUser: JoinedUserDoc;
let fakeTeacher: JoinedUserDoc;
let fakePackage: any;
let fakePackageTransaction: PackageTransactionDoc;
let fakeAppointment: AppointmentDoc;
let dbServiceAccessOptions: DbServiceAccessOptions;

before(async () => {
  packageDbService = await makePackageDbService;
  packageTransactionDbService = await makePackageTransactionDbService;
  appointmentDbService = await makeAppointmentDbService;
  fakeDbPackageFactory = await makeFakeDbPackageFactory;
  fakeDbUserFactory = await makeFakeDbUserFactory;
  fakeDbPackageTransactionFactory = await makeFakeDbPackageTransactionFactory;
  fakeDbAppointmentFactory = await makeFakeDbAppointmentFactory;
});

beforeEach(async () => {
  dbServiceAccessOptions = packageDbService.getBaseDbServiceAccessOptions();
  fakeUser = await fakeDbUserFactory.createFakeDbUser();
  fakeTeacher = await fakeDbUserFactory.createFakeDbTeacher();
  fakePackage = fakeTeacher.teacherData!.packages[0];
  fakePackageTransaction = await fakeDbPackageTransactionFactory.createFakeDbData({
    hostedById: fakeTeacher._id,
    reservedById: fakeUser._id,
    packageId: fakePackage._id,
    lessonDuration: 60,
    remainingAppointments: 0,
    lessonLanguage: 'ja',
    isSubscription: false,
  });
  const endDate = new Date();
  endDate.setMinutes(endDate.getMinutes() + 30);
  fakeAppointment = await fakeDbAppointmentFactory.createFakeDbData({
    hostedById: fakePackageTransaction.hostedById,
    reservedById: fakePackageTransaction.reservedById,
    packageTransactionId: fakePackageTransaction._id,
    startDate: new Date(),
    endDate,
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
          const findByIdPackageCache = await packageDbService.findById({
            _id: fakePackage._id,
            dbServiceAccessOptions,
          });
          const findOnePackage = await packageDbService.findOne({
            searchQuery: {
              _id: fakePackage._id,
            },
            dbServiceAccessOptions,
          });
          const findPackages = await packageDbService.find(findParams);
          expect((findByIdPackage as PackageDoc).lessonDurations).to.deep.equal(
            (findByIdPackageCache as PackageDoc).lessonDurations
          );
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
            dbServiceAccessOptions.currentAPIUserRole = 'admin';
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
    it('should throw an error', async () => {
      const { _id, ...modelToInsert } = fakePackage;
      try {
        fakePackage = await packageDbService.insert({
          modelToInsert,
          dbServiceAccessOptions,
        });
      } catch (err) {
        expect(err).to.be.an('error');
      }
    });
  });

  describe('update', () => {
    const updatePackage = async () => {
      const overrideDbServiceAccessOptions =
        appointmentDbService.getOverrideDbServiceAccessOptions();
      const updatedPackage = (await packageDbService.findOneAndUpdate({
        searchQuery: { _id: fakePackage._id },
        updateQuery: { packageType: 'custom' },
        dbServiceAccessOptions,
      })) as PackageDoc;
      const updatedPackageTransaction = await packageTransactionDbService.findOne({
        searchQuery: { packageId: fakePackage._id },
        dbServiceAccessOptions,
      });
      const updatedAppointment = await appointmentDbService.findOne({
        searchQuery: {
          packageTransactionId: updatedPackageTransaction._id,
        },
        dbServiceAccessOptions: overrideDbServiceAccessOptions,
      });
      expect(updatedPackage).to.not.deep.equal(fakePackage);
      expect(updatedPackage.packageType).to.equal('custom');
      expect(updatedPackageTransaction.packageData.packageType).to.equal('custom');
      expect(updatedAppointment.packageTransactionData.packageData.packageType).to.equal('custom');
    };
    context('db access permitted', () => {
      context('invalid inputs', () => {
        it('should return the original package if update field does not exist', async () => {
          const updatedPackage = await packageDbService.findOneAndUpdate({
            searchQuery: { _id: fakePackage._id },
            updateQuery: {
              nonExistentField: 'some non-existent field',
            },
            dbServiceAccessOptions,
          });
          expect(updatedPackage).to.deep.equal(fakePackage);
        });
        it('should return null if the package to update does not exist', async () => {
          const updatedPackage = await packageDbService.findOneAndUpdate({
            searchQuery: {
              _id: '608c09b0f12568001535df9a',
            },
            updateQuery: { packageType: 'custom' },
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
        } catch (err: any) {
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
            _id: undefined,
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
        } catch (err: any) {
          expect(err.message).to.equal('Access denied.');
        }
      });
    });
  });
});
