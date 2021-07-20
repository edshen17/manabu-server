import { expect } from 'chai';
import { makeMinuteBankDbService } from '.';
import { MinuteBankDoc } from '../../../../models/MinuteBank';
import { DbServiceAccessOptions } from '../../abstractions/IDbService';
import { makeFakeDbMinuteBankFactory } from '../../testFixtures/fakeDbMinuteBankFactory';
import { FakeDbMinuteBankFactory } from '../../testFixtures/fakeDbMinuteBankFactory/fakeDbMinuteBankFactory';
import { MinuteBankDbService } from './minuteBankDbService';

let minuteBankDbService: MinuteBankDbService;
let fakeDbMinuteBankFactory: FakeDbMinuteBankFactory;
let dbServiceAccessOptions: DbServiceAccessOptions;
let fakeMinuteBank: MinuteBankDoc;

before(async () => {
  minuteBankDbService = await makeMinuteBankDbService;
  fakeDbMinuteBankFactory = await makeFakeDbMinuteBankFactory;
});

beforeEach(async () => {
  dbServiceAccessOptions = fakeDbMinuteBankFactory.getDbServiceAccessOptions();
  fakeMinuteBank = await fakeDbMinuteBankFactory.createFakeDbData();
});

describe('minuteBankDbService', () => {
  describe('findById, findOne, find', () => {
    context('db access permitted', () => {
      context('invalid inputs', () => {
        it('should throw an error if given an invalid id', async () => {
          try {
            const findByIdMinuteBank = await minuteBankDbService.findById({
              _id: 'undefined',
              dbServiceAccessOptions,
            });
          } catch (err) {
            expect(err).to.be.an('error');
          }
        });
      });
      context('valid inputs', () => {
        const getMinuteBank = async () => {
          const findMinuteBanks = await minuteBankDbService.find({
            searchQuery: { _id: fakeMinuteBank._id },
            dbServiceAccessOptions,
          });
          const findByIdMinuteBank = await minuteBankDbService.findById({
            _id: fakeMinuteBank._id,
            dbServiceAccessOptions,
          });
          const findOneMinuteBank = await minuteBankDbService.findOne({
            searchQuery: { _id: fakeMinuteBank._id },
            dbServiceAccessOptions,
          });
          expect(findMinuteBanks[0]).to.deep.equal(findByIdMinuteBank);
          expect(findByIdMinuteBank).to.deep.equal(findOneMinuteBank);
          expect(findByIdMinuteBank.hostedByData).to.not.have.property('email');
          expect(findByIdMinuteBank.hostedByData).to.not.have.property('settings');
          expect(findByIdMinuteBank.hostedByData).to.not.have.property('password');
          expect(findByIdMinuteBank.reservedByData).to.not.have.property('email');
          expect(findByIdMinuteBank.reservedByData).to.not.have.property('settings');
          expect(findByIdMinuteBank.reservedByData).to.not.have.property('password');
        };
        context('as a non-admin user', () => {
          context('viewing self', () => {
            it('should find the minuteBank and return a restricted view on user data', async () => {
              dbServiceAccessOptions.isSelf = true;
              await getMinuteBank();
            });
          });
          context('viewing other', () => {
            it('should find the minuteBank and return a restricted view on user data', async () => {
              await getMinuteBank();
            });
          });
        });
        context('as an admin', () => {
          it('should find the minuteBank and return a restricted view on user data', async () => {
            dbServiceAccessOptions.currentAPIUserRole = 'admin';
            await getMinuteBank();
          });
        });
      });
    });
    context('db access denied', () => {
      it('should throw an error', async () => {
        dbServiceAccessOptions.isCurrentAPIUserPermitted = false;
        try {
          const findMinuteBanks = await minuteBankDbService.find({
            searchQuery: { _id: fakeMinuteBank._id },
            dbServiceAccessOptions,
          });
        } catch (err) {
          expect(err.message).to.equal('Access denied.');
        }
      });
    });
  });
  describe('insert', () => {
    context('db access permitted', () => {
      context('invalid inputs', () => {
        it('should throw an error if required fields are not given', async () => {
          try {
            fakeMinuteBank = await minuteBankDbService.insert({
              modelToInsert: {},
              dbServiceAccessOptions,
            });
          } catch (err) {
            expect(err).to.be.an('error');
          }
        });
      });
      context('valid inputs', () => {
        it('should insert a new minuteBank', async () => {
          const findByIdMinuteBank = await minuteBankDbService.findById({
            _id: fakeMinuteBank._id,
            dbServiceAccessOptions,
          });
          expect(fakeMinuteBank).to.not.equal(null);
          expect(findByIdMinuteBank).to.deep.equal(fakeMinuteBank);
        });
      });
    });
    context('db access denied', () => {
      it('should throw an error', async () => {
        dbServiceAccessOptions.isCurrentAPIUserPermitted = false;
        const { _id, ...modelToInsert } = fakeMinuteBank;
        try {
          fakeMinuteBank = await minuteBankDbService.insert({
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
    const updateMinuteBank = async () => {
      const updatedMinuteBank = await minuteBankDbService.findOneAndUpdate({
        searchQuery: { _id: fakeMinuteBank._id },
        updateQuery: { minuteBank: 10 },
        dbServiceAccessOptions,
      });
      expect(updatedMinuteBank).to.not.deep.equal(fakeMinuteBank);
      expect(updatedMinuteBank.minuteBank).to.equal(10);
    };
    context('db access permitted', () => {
      context('invalid inputs', () => {
        it('should return the original minuteBank if update field does not exist', async () => {
          const updatedMinuteBank = await minuteBankDbService.findOneAndUpdate({
            searchQuery: {
              hostedById: fakeMinuteBank.hostedById,
            },
            updateQuery: {
              nonExistentField: 'some non-existent field',
            },
            dbServiceAccessOptions,
          });
          expect(updatedMinuteBank).to.deep.equal(fakeMinuteBank);
        });
        it('should return null if the minuteBank to update does not exist', async () => {
          const updatedMinuteBank = await minuteBankDbService.findOneAndUpdate({
            searchQuery: {
              _id: fakeMinuteBank.hostedById,
            },
            updateQuery: { minuteBank: 10 },
            dbServiceAccessOptions,
          });
          expect(updatedMinuteBank).to.equal(null);
        });
      });
      context('valid inputs', () => {
        context('as a non-admin user', () => {
          context('updating self', () => {
            it('should update the minuteBank', async () => {
              dbServiceAccessOptions.isSelf = true;
              await updateMinuteBank();
            });
          });
          context('updating other', async () => {
            it('should update the minuteBank', async () => {
              await updateMinuteBank();
            });
          });
        });
        context('as an admin', async () => {
          it('should update the minuteBank', async () => {
            dbServiceAccessOptions.currentAPIUserRole = 'admin';
            await updateMinuteBank();
          });
        });
      });
    });
    context('db access denied', () => {
      it('should throw an error', async () => {
        dbServiceAccessOptions.isCurrentAPIUserPermitted = false;
        try {
          await updateMinuteBank();
        } catch (err) {
          expect(err.message).to.equal('Access denied.');
        }
      });
    });
  });
  describe('delete', () => {
    const deleteMinuteBank = async () => {
      const deletedMinuteBank = await minuteBankDbService.findByIdAndDelete({
        _id: fakeMinuteBank._id,
        dbServiceAccessOptions,
      });
      const foundMinuteBank = await minuteBankDbService.findById({
        _id: fakeMinuteBank._id,
        dbServiceAccessOptions,
      });
      expect(foundMinuteBank).to.not.deep.equal(deletedMinuteBank);
      expect(foundMinuteBank).to.be.equal(null);
    };
    context('db access permitted', () => {
      context('invalid inputs', () => {
        it('should return null if the minuteBank to delete does not exist', async () => {
          const deletedMinuteBank = await minuteBankDbService.findByIdAndDelete({
            _id: fakeMinuteBank.hostedById,
            dbServiceAccessOptions,
          });
          expect(deletedMinuteBank).to.equal(null);
        });
      });
      context('valid inputs', () => {
        context('as a non-admin user', () => {
          context('deleting self', () => {
            it('should update the minuteBank', async () => {
              dbServiceAccessOptions.isSelf = true;
              await deleteMinuteBank();
            });
          });
          context('deleting other', async () => {
            it('should update the minuteBank', async () => {
              await deleteMinuteBank();
            });
          });
        });
        context('as an admin', async () => {
          it('should update the minuteBank', async () => {
            dbServiceAccessOptions.currentAPIUserRole = 'admin';
            await deleteMinuteBank();
          });
        });
      });
    });
    context('db access denied', () => {
      it('should throw an error', async () => {
        dbServiceAccessOptions.isCurrentAPIUserPermitted = false;
        try {
          await deleteMinuteBank();
        } catch (err) {
          expect(err.message).to.equal('Access denied.');
        }
      });
    });
  });
});
