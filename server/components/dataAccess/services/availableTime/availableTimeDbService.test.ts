import { expect } from 'chai';
import { makeAvailableTimeDbService } from '.';
import { AvailableTimeDoc } from '../../../../models/AvailableTime';
import { DbServiceAccessOptions } from '../../abstractions/IDbService';
import { makeFakeDbAvailableTimeFactory } from '../../testFixtures/fakeDbAvailableTimeFactory';
import { FakeDbAvailableTimeFactory } from '../../testFixtures/fakeDbAvailableTimeFactory/fakeDbAvailableTimeFactory';
import { AvailableTimeDbService } from './availableTimeDbService';

let availableTimeDbService: AvailableTimeDbService;
let fakeDbAvailableTimeFactory: FakeDbAvailableTimeFactory;
let dbServiceAccessOptions: DbServiceAccessOptions;
let fakeAvailableTime: AvailableTimeDoc;

before(async () => {
  availableTimeDbService = await makeAvailableTimeDbService;
  fakeDbAvailableTimeFactory = await makeFakeDbAvailableTimeFactory;
});

beforeEach(async () => {
  dbServiceAccessOptions = availableTimeDbService.getBaseDbServiceAccessOptions();
  fakeAvailableTime = await fakeDbAvailableTimeFactory.createFakeDbData();
});

describe('availableTimeDbService', () => {
  describe('findById, findOne, find', () => {
    context('db access permitted', () => {
      context('invalid inputs', () => {
        it('should throw an error if given an invalid id', async () => {
          try {
            await availableTimeDbService.findById({
              _id: undefined,
              dbServiceAccessOptions,
            });
          } catch (err) {
            expect(err).be.an('error');
          }
        });
        it('should return null if given an non-existent id', async () => {
          const findByIdAvailableTime = await availableTimeDbService.findById({
            _id: '60979db0bb31ed001589a1ea',
            dbServiceAccessOptions,
          });
          expect(findByIdAvailableTime).to.equal(null);
        });
      });
      context('valid inputs', () => {
        const getAvailableTime = async () => {
          const findParams = {
            searchQuery: {
              hostedById: fakeAvailableTime.hostedById,
            },
            dbServiceAccessOptions,
          };
          const findByIdAvailableTime = await availableTimeDbService.findById({
            _id: fakeAvailableTime._id,
            dbServiceAccessOptions,
          });
          const findOneAvailableTime = await availableTimeDbService.findOne(findParams);
          const findAvailableTimes = await availableTimeDbService.find(findParams);
          expect(findByIdAvailableTime).to.deep.equal(findOneAvailableTime);
          expect(findByIdAvailableTime).to.deep.equal(findAvailableTimes[0]);
        };
        context('as a non-admin user', () => {
          context('viewing self', () => {
            it('should find the AvailableTime and return an unrestricted view on some data', async () => {
              dbServiceAccessOptions.isSelf = true;
              await getAvailableTime();
            });
          });
          context('viewing other', () => {
            it('should find the AvailableTime and return an unrestricted view on some data', async () => {
              await getAvailableTime();
            });
          });
        });
        context('as an admin', () => {
          it('should find the AvailableTime and return an restricted view on some data', async () => {
            dbServiceAccessOptions.currentAPIUserRole = 'admin';
            await getAvailableTime();
          });
        });
      });
    });
    context('db access denied', () => {
      it('should throw an error', async () => {
        dbServiceAccessOptions.isCurrentAPIUserPermitted = false;
        let err;
        try {
          err = await availableTimeDbService.findById({
            _id: fakeAvailableTime._id,
            dbServiceAccessOptions,
          });
        } catch (err) {
          return;
        }
        expect(err).to.be.an('error');
      });
    });
  });
  describe('insert', () => {
    context('db access permitted', () => {
      context('invalid inputs', () => {
        it('should throw an error if required fields are not given', async () => {
          try {
            fakeAvailableTime = await availableTimeDbService.insert({
              modelToInsert: {},
              dbServiceAccessOptions,
            });
          } catch (err) {
            expect(err).to.be.an('error');
          }
        });
      });
      context('valid inputs', () => {
        it('should insert an AvailableTime', async () => {
          const findByIdAvailableTime = await availableTimeDbService.findById({
            _id: fakeAvailableTime._id,
            dbServiceAccessOptions,
          });
          expect(findByIdAvailableTime).to.not.equal(null);
          expect(findByIdAvailableTime).to.deep.equal(fakeAvailableTime);
        });
      });
    });
    context('db access denied', () => {
      it('should throw an error', async () => {
        dbServiceAccessOptions.isCurrentAPIUserPermitted = false;
        const { _id, ...modelToInsert } = fakeAvailableTime;
        try {
          fakeAvailableTime = await availableTimeDbService.insert({
            modelToInsert,
            dbServiceAccessOptions,
          });
        } catch (err: any) {
          expect(err.message).to.equal('Access denied.');
        }
      });
    });
  });
  describe('update', () => {
    const updateAvailableTime = async () => {
      const updatedAvailableTime = await availableTimeDbService.findOneAndUpdate({
        searchQuery: { _id: fakeAvailableTime._id },
        updateQuery: { startDate: new Date() },
        dbServiceAccessOptions,
      });
      expect(updatedAvailableTime).to.not.deep.equal(fakeAvailableTime);
      expect(updatedAvailableTime.startDate).to.not.equal(fakeAvailableTime.startDate);
    };
    context('db access permitted', () => {
      context('invalid inputs', () => {
        it('should return the original AvailableTime if update field does not exist', async () => {
          const updatedAvailableTime = await availableTimeDbService.findOneAndUpdate({
            searchQuery: {
              hostedById: fakeAvailableTime.hostedById,
            },
            updateQuery: {
              nonExistentField: 'some non-existent field',
            },
            dbServiceAccessOptions,
          });
          expect(updatedAvailableTime).to.deep.equal(fakeAvailableTime);
        });
        it('should return null if the AvailableTime to update does not exist', async () => {
          const updatedAvailableTime = await availableTimeDbService.findOneAndUpdate({
            searchQuery: {
              _id: fakeAvailableTime.hostedById,
            },
            updateQuery: { status: 'cancelled' },
            dbServiceAccessOptions,
          });
          expect(updatedAvailableTime).to.equal(null);
        });
      });
      context('valid inputs', () => {
        context('as a non-admin user', () => {
          context('updating self', () => {
            it('should update the AvailableTime', async () => {
              dbServiceAccessOptions.isSelf = true;
              await updateAvailableTime();
            });
          });
          context('updating other', async () => {
            it('should update the AvailableTime', async () => {
              await updateAvailableTime();
            });
          });
        });
        context('as an admin', async () => {
          it('should update the AvailableTime', async () => {
            dbServiceAccessOptions.currentAPIUserRole = 'admin';
            await updateAvailableTime();
          });
        });
      });
    });
    context('db access denied', () => {
      it('should throw an error', async () => {
        dbServiceAccessOptions.isCurrentAPIUserPermitted = false;
        try {
          await updateAvailableTime();
        } catch (err: any) {
          expect(err.message).to.equal('Access denied.');
        }
      });
    });
  });
  describe('delete', () => {
    const deleteAvailableTime = async () => {
      const deletedAvailableTime = await availableTimeDbService.findByIdAndDelete({
        _id: fakeAvailableTime._id,
        dbServiceAccessOptions,
      });
      const foundAvailableTime = await availableTimeDbService.findById({
        _id: fakeAvailableTime._id,
        dbServiceAccessOptions,
      });
      expect(foundAvailableTime).to.not.deep.equal(deletedAvailableTime);
      expect(foundAvailableTime).to.be.equal(null);
    };
    context('db access permitted', () => {
      context('invalid inputs', () => {
        it('should return null if the minuteBank to delete does not exist', async () => {
          const deletedAvailableTime = await availableTimeDbService.findByIdAndDelete({
            _id: fakeAvailableTime.hostedById,
            dbServiceAccessOptions,
          });
          expect(deletedAvailableTime).to.equal(null);
        });
      });
      context('valid inputs', () => {
        context('as a non-admin user', () => {
          context('deleting self', () => {
            it('should update the minuteBank', async () => {
              dbServiceAccessOptions.isSelf = true;
              await deleteAvailableTime();
            });
          });
          context('deleting other', async () => {
            it('should update the minuteBank', async () => {
              await deleteAvailableTime();
            });
          });
        });
        context('as an admin', async () => {
          it('should update the minuteBank', async () => {
            dbServiceAccessOptions.currentAPIUserRole = 'admin';
            await deleteAvailableTime();
          });
        });
      });
    });
    context('db access denied', () => {
      it('should throw an error', async () => {
        dbServiceAccessOptions.isCurrentAPIUserPermitted = false;
        try {
          await deleteAvailableTime();
        } catch (err: any) {
          expect(err.message).to.equal('Access denied.');
        }
      });
    });
  });
});
