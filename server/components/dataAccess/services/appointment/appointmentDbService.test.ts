import { expect } from 'chai';
import { makeAppointmentDbService } from '.';
import { AppointmentDoc } from '../../../../models/Appointment';
import { PackageTransactionDoc } from '../../../../models/PackageTransaction';
import { DbServiceAccessOptions } from '../../abstractions/IDbService';
import { makeFakeDbAppointmentFactory } from '../../testFixtures/fakeDbAppointmentFactory';
import { FakeDbAppointmentFactory } from '../../testFixtures/fakeDbAppointmentFactory/fakeDbAppointmentFactory';
import { makeFakeDbPackageTransactionFactory } from '../../testFixtures/fakeDbPackageTransactionFactory';
import { FakeDbPackageTransactionFactory } from '../../testFixtures/fakeDbPackageTransactionFactory/fakeDbPackageTransactionFactory';
import { AppointmentDbService } from './appointmentDbService';

let appointmentDbService: AppointmentDbService;
let fakeDbAppointmentFactory: FakeDbAppointmentFactory;
let fakeDbPackageTransactionFactory: FakeDbPackageTransactionFactory;
let dbServiceAccessOptions: DbServiceAccessOptions;
let fakePackageTransaction: PackageTransactionDoc;
let fakeAppointment: AppointmentDoc;

before(async () => {
  appointmentDbService = await makeAppointmentDbService;
  fakeDbAppointmentFactory = await makeFakeDbAppointmentFactory;
  fakeDbPackageTransactionFactory = await makeFakeDbPackageTransactionFactory;
});

beforeEach(async () => {
  dbServiceAccessOptions = fakeDbAppointmentFactory.getDbServiceAccessOptions();
  fakePackageTransaction = await fakeDbPackageTransactionFactory.createFakeDbData();
  fakeAppointment = await fakeDbAppointmentFactory.createFakeDbData({
    hostedBy: fakePackageTransaction.hostedBy.toString(),
    reservedBy: fakePackageTransaction.reservedBy.toString(),
    packageTransactionId: fakePackageTransaction._id,
    from: new Date(),
    to: new Date(),
  });
});

describe('appointmentDbService', () => {
  describe('findById, findOne, find', () => {
    context('db access permitted', () => {
      context('invalid inputs', () => {
        it('should throw an error if given an invalid id', async () => {
          try {
            await appointmentDbService.findById({
              _id: undefined,
              dbServiceAccessOptions,
            });
          } catch (err) {
            expect(err).be.an('error');
          }
        });
        it('should return null if given an non-existent id', async () => {
          const findByIdAppointment = await appointmentDbService.findById({
            _id: '60979db0bb31ed001589a1ea',
            dbServiceAccessOptions,
          });
          expect(findByIdAppointment).to.equal(null);
        });
      });
      context('valid inputs', () => {
        const getAppointment = async (dbServiceAccessOptions: DbServiceAccessOptions) => {
          const findParams = {
            searchQuery: {
              hostedBy: fakeAppointment.hostedBy,
            },
            dbServiceAccessOptions,
          };
          const findByIdAppointment = await appointmentDbService.findById({
            _id: fakeAppointment._id,
            dbServiceAccessOptions,
          });
          const findOneAppointment = await appointmentDbService.findOne(findParams);
          const findAppointments = await appointmentDbService.find(findParams);
          const appointmentPackageTransactionData: any = findByIdAppointment.packageTransactionData;
          expect(findByIdAppointment._id.toString()).to.equal(findOneAppointment._id.toString());
          expect(findByIdAppointment._id.toString()).to.equal(findAppointments[0]._id.toString());
          expect(appointmentPackageTransactionData.hostedByData).to.not.have.property('password');
          expect(appointmentPackageTransactionData.hostedByData).to.not.have.property('email');
          expect(appointmentPackageTransactionData.hostedByData).to.not.have.property('settings');
          expect(appointmentPackageTransactionData.hostedByData).to.not.have.property(
            'commMethods'
          );
          expect(appointmentPackageTransactionData.reservedByData).to.not.have.property('password');
          expect(appointmentPackageTransactionData.reservedByData).to.not.have.property('email');
          expect(appointmentPackageTransactionData.reservedByData).to.not.have.property('settings');
          expect(appointmentPackageTransactionData.reservedByData).to.not.have.property(
            'commMethods'
          );
        };
        context('as a non-admin user', () => {
          context('viewing self', () => {
            it('should find the appointment and return an restricted view on some data', async () => {
              dbServiceAccessOptions.isSelf = true;
              await getAppointment(dbServiceAccessOptions);
            });
          });
          context('viewing other', () => {
            it('should find the appointment and return an restricted view on some data', async () => {
              await getAppointment(dbServiceAccessOptions);
            });
          });
        });
        context('as an admin', () => {
          it('should find the appointment and return an restricted view on some data', async () => {
            await getAppointment(dbServiceAccessOptions);
          });
        });
      });
    });
    context('db access denied', () => {
      it('should throw an error', async () => {
        dbServiceAccessOptions.isCurrentAPIUserPermitted = false;
        try {
          const findByIdAppointment = await appointmentDbService.findById({
            _id: fakeAppointment._id,
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
          dbServiceAccessOptions.isCurrentAPIUserPermitted = false;
          const { _id, ...modelToInsert } = fakeAppointment;
          try {
            fakeAppointment = await appointmentDbService.insert({
              modelToInsert,
              dbServiceAccessOptions,
            });
          } catch (err) {
            expect(err.message).to.equal('Access denied.');
          }
        });
      });
      context('valid inputs', () => {
        it('should insert an appointment', async () => {
          const findByIdAppointment = await appointmentDbService.findById({
            _id: fakeAppointment._id,
            dbServiceAccessOptions,
          });
          expect(findByIdAppointment).to.not.equal(null);
          expect(findByIdAppointment).to.deep.equal(fakeAppointment);
        });
      });
    });
    context('db access denied', () => {
      it('should throw an error', async () => {
        try {
          fakeAppointment = await appointmentDbService.insert({
            modelToInsert: {},
            dbServiceAccessOptions,
          });
        } catch (err) {
          expect(err).to.be.an('error');
        }
      });
    });
  });
  describe('update', () => {
    const updateAppointment = async () => {
      const updatedAppointment = await appointmentDbService.findOneAndUpdate({
        searchQuery: { _id: fakeAppointment._id },
        updateParams: { status: 'cancelled' },
        dbServiceAccessOptions,
      });
      expect(updatedAppointment).to.not.deep.equal(fakeAppointment);
      expect(updatedAppointment.status).to.equal('cancelled');
    };
    context('db access permitted', () => {
      context('invalid inputs', () => {
        it('should return the original appointment if update field does not exist', async () => {
          const updatedAppointment = await appointmentDbService.findOneAndUpdate({
            searchQuery: {
              hostedBy: fakeAppointment.hostedBy,
            },
            updateParams: {
              nonExistentField: 'some non-existent field',
            },
            dbServiceAccessOptions,
          });
          expect(updatedAppointment).to.deep.equal(fakeAppointment);
        });
        it('should return null if the appointment to update does not exist', async () => {
          const updatedAppointment = await appointmentDbService.findOneAndUpdate({
            searchQuery: {
              _id: fakeAppointment.hostedBy,
            },
            updateParams: {
              nonExistentField: 'some non-existent field',
            },
            dbServiceAccessOptions,
          });
          expect(updatedAppointment).to.equal(null);
        });
      });
      context('valid inputs', () => {
        context('as a non-admin user', () => {
          context('updating self', () => {
            it('should update the appointment', async () => {
              await updateAppointment();
            });
          });
          context('updating other', async () => {
            it('should update the appointment', async () => {
              await updateAppointment();
            });
          });
        });
        context('as an admin', async () => {
          it('should update the appointment', async () => {
            await updateAppointment();
          });
        });
      });
    });
    context('db access denied', () => {
      it('should throw an error', async () => {
        dbServiceAccessOptions.isCurrentAPIUserPermitted = false;
        try {
          await updateAppointment();
        } catch (err) {
          expect(err.message).to.equal('Access denied.');
        }
      });
    });
  });
  describe('delete', () => {
    const deleteAppointment = async () => {
      const deletedPackage = await appointmentDbService.findByIdAndDelete({
        _id: fakeAppointment._id,
        dbServiceAccessOptions,
      });
      const foundPackage = await appointmentDbService.findById({
        _id: fakeAppointment._id,
        dbServiceAccessOptions,
      });
      expect(foundPackage).to.not.deep.equal(deletedPackage);
      expect(foundPackage).to.be.equal(null);
    };
    context('db access permitted', () => {
      context('invalid inputs', () => {
        it('should return null if the package to delete does not exist', async () => {
          const deletedPackage = await appointmentDbService.findByIdAndDelete({
            _id: fakeAppointment.hostedBy,
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
              await deleteAppointment();
            });
          });
          context('deleting other', async () => {
            it('should update the package', async () => {
              await deleteAppointment();
            });
          });
        });
        context('as an admin', async () => {
          it('should update the package', async () => {
            dbServiceAccessOptions.currentAPIUserRole = 'admin';
            await deleteAppointment();
          });
        });
      });
    });
    context('db access denied', () => {
      it('should throw an error', async () => {
        dbServiceAccessOptions.isCurrentAPIUserPermitted = false;
        try {
          await deleteAppointment();
        } catch (err) {
          expect(err.message).to.equal('Access denied.');
        }
      });
    });
  });
});
