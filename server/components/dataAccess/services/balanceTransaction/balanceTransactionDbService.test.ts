import { expect } from 'chai';
import { makeBalanceTransactionDbService } from '.';
import { BalanceTransactionDoc } from '../../../../models/BalanceTransaction';
import { DbServiceAccessOptions } from '../../abstractions/IDbService';
import { makeFakeDbBalanceTransactionFactory } from '../../testFixtures/fakeDbBalanceTransactionFactory';
import { FakeDbBalanceTransactionFactory } from '../../testFixtures/fakeDbBalanceTransactionFactory/fakeDbBalanceTransactionFactory';
import { makePackageTransactionDbService } from '../packageTransaction';
import { PackageTransactionDbService } from '../packageTransaction/packageTransactionDbService';
import { BalanceTransactionDbService } from './balanceTransactionDbService';

let balanceTransactionDbService: BalanceTransactionDbService;
let packageTransactionDbService: PackageTransactionDbService;
let dbServiceAccessOptions: DbServiceAccessOptions;
let fakeDbBalanceTransactionFactory: FakeDbBalanceTransactionFactory;
let fakeBalanceTransaction: BalanceTransactionDoc;

before(async () => {
  balanceTransactionDbService = await makeBalanceTransactionDbService;
  packageTransactionDbService = await makePackageTransactionDbService;
  fakeDbBalanceTransactionFactory = await makeFakeDbBalanceTransactionFactory;
});

beforeEach(async () => {
  fakeBalanceTransaction = await fakeDbBalanceTransactionFactory.createFakeDbData();
  dbServiceAccessOptions = balanceTransactionDbService.getBaseDbServiceAccessOptions();
});

describe('balanceTransactionDbService', () => {
  describe('findById, findOne, find', () => {
    context('db access permitted', () => {
      context('invalid inputs', () => {
        it('should throw an error if given an invalid id', async () => {
          try {
            await balanceTransactionDbService.findById({
              _id: undefined,
              dbServiceAccessOptions,
            });
          } catch (err) {
            expect(err).be.an('error');
          }
        });
        it('should return null if given an non-existent id', async () => {
          const findByIdBalanceTransaction = await balanceTransactionDbService.findById({
            _id: '60979db0bb31ed001589a1ea',
            dbServiceAccessOptions,
          });
          expect(findByIdBalanceTransaction).to.equal(null);
        });
      });
      context('valid inputs', () => {
        const getBalanceTransaction = async () => {
          const findParams = {
            searchQuery: {
              packageTransactionId: fakeBalanceTransaction.packageTransactionId,
            },
            dbServiceAccessOptions,
          };
          const findByIdBalanceTransaction = await balanceTransactionDbService.findById({
            _id: fakeBalanceTransaction._id,
            dbServiceAccessOptions,
          });
          const findOneBalanceTransaction = await balanceTransactionDbService.findOne(findParams);
          const findBalanceTransactions = await balanceTransactionDbService.find(findParams);
          expect(findByIdBalanceTransaction).to.deep.equal(findOneBalanceTransaction);
          expect(findByIdBalanceTransaction).to.deep.equal(findBalanceTransactions[0]);
          expect(findByIdBalanceTransaction).to.have.property('packageTransactionData');
        };
        context('as a non-admin user', () => {
          context('viewing self', () => {
            it('should find the balanceTransaction and return an restricted view on some data', async () => {
              dbServiceAccessOptions.isSelf = true;
              await getBalanceTransaction();
            });
          });
          context('viewing other', () => {
            it('should find the balanceTransaction and return an restricted view on some data', async () => {
              await getBalanceTransaction();
            });
          });
        });
        context('as an admin', () => {
          it('should find the balanceTransaction and return an restricted view on some data', async () => {
            await getBalanceTransaction();
          });
        });
      });
    });
    context('db access denied', () => {
      it('should throw an error', async () => {
        dbServiceAccessOptions.isCurrentAPIUserPermitted = false;
        let error;
        try {
          await balanceTransactionDbService.findById({
            _id: fakeBalanceTransaction._id,
            dbServiceAccessOptions,
          });
        } catch (err) {
          error = err;
        }
        expect(error).to.be.an('error');
      });
    });
  });
  describe('insert', () => {
    context('db access permitted', () => {
      context('invalid inputs', () => {
        it('should throw an error if required fields are not given', async () => {
          try {
            fakeBalanceTransaction = await balanceTransactionDbService.insert({
              modelToInsert: {},
              dbServiceAccessOptions,
            });
          } catch (err) {
            expect(err).to.be.an('error');
          }
        });
      });
      context('valid inputs', () => {
        it('should insert a balanceTransaction', async () => {
          const findByIdBalanceTransaction = await balanceTransactionDbService.findById({
            _id: fakeBalanceTransaction._id,
            dbServiceAccessOptions,
          });
          expect(findByIdBalanceTransaction).to.not.equal(null);
          expect(findByIdBalanceTransaction).to.deep.equal(fakeBalanceTransaction);
        });
      });
    });
    context('db access denied', () => {
      it('should throw an error', async () => {
        dbServiceAccessOptions.isCurrentAPIUserPermitted = false;
        const { _id, ...modelToInsert } = fakeBalanceTransaction;
        try {
          fakeBalanceTransaction = await balanceTransactionDbService.insert({
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
    const updateBalanceTransaction = async () => {
      const overrideDbServiceAccessOptions =
        balanceTransactionDbService.getOverrideDbServiceAccessOptions();
      const updatedPackageTransaction = await packageTransactionDbService.findOneAndUpdate({
        searchQuery: { _id: fakeBalanceTransaction.packageTransactionId },
        updateQuery: { lessonLanguage: 'en' },
        dbServiceAccessOptions,
      });
      const updatedBalanceTransaction = await balanceTransactionDbService.findOne({
        searchQuery: { packageTransactionId: updatedPackageTransaction._id },
        dbServiceAccessOptions: overrideDbServiceAccessOptions,
      });
      expect(updatedBalanceTransaction).to.not.deep.equal(fakeBalanceTransaction);
      expect(updatedBalanceTransaction.packageTransactionData.lessonLanguage).to.equal('en');
    };
    context('db access permitted', () => {
      context('invalid inputs', () => {
        it('should return null if the balanceTransaction to update does not exist', async () => {
          const updatedBalanceTransaction = await balanceTransactionDbService.findOneAndUpdate({
            searchQuery: {
              _id: fakeBalanceTransaction.packageTransactionId,
            },
            updateQuery: { currency: 'USD' },
            dbServiceAccessOptions,
          });
          expect(updatedBalanceTransaction).to.equal(null);
        });
      });
      context('valid inputs', () => {
        context('as a non-admin user', () => {
          context('updating self', () => {
            it('should update the balanceTransaction', async () => {
              dbServiceAccessOptions.isSelf = true;
              await updateBalanceTransaction();
            });
          });
          context('updating other', async () => {
            it('should update the balanceTransaction', async () => {
              await updateBalanceTransaction();
            });
          });
        });
        context('as an admin', async () => {
          it('should update the balanceTransaction', async () => {
            dbServiceAccessOptions.currentAPIUserRole = 'admin';
            await updateBalanceTransaction();
          });
        });
      });
    });
    context('db access denied', () => {
      it('should throw an error', async () => {
        dbServiceAccessOptions.isCurrentAPIUserPermitted = false;
        try {
          await updateBalanceTransaction();
        } catch (err: any) {
          expect(err.message).to.equal('Access denied.');
        }
      });
    });
  });

  describe('delete', () => {
    const deleteBalanceTransaction = async () => {
      const deletedPackage = await balanceTransactionDbService.findByIdAndDelete({
        _id: fakeBalanceTransaction._id,
        dbServiceAccessOptions,
      });
      const foundPackage = await balanceTransactionDbService.findById({
        _id: fakeBalanceTransaction._id,
        dbServiceAccessOptions,
      });
      expect(foundPackage).to.not.deep.equal(deletedPackage);
      expect(foundPackage).to.be.equal(null);
    };
    context('db access permitted', () => {
      context('invalid inputs', () => {
        it('should return null if the balanceTransaction to delete does not exist', async () => {
          const deletedPackage = await balanceTransactionDbService.findByIdAndDelete({
            _id: fakeBalanceTransaction.packageTransactionId,
            dbServiceAccessOptions,
          });
          expect(deletedPackage).to.equal(null);
        });
      });
      context('valid inputs', () => {
        context('as a non-admin user', () => {
          context('deleting self', () => {
            it('should update the balanceTransaction', async () => {
              dbServiceAccessOptions.isSelf = true;
              await deleteBalanceTransaction();
            });
          });
          context('deleting other', async () => {
            it('should update the balanceTransaction', async () => {
              await deleteBalanceTransaction();
            });
          });
        });
        context('as an admin', async () => {
          it('should update the balanceTransaction', async () => {
            dbServiceAccessOptions.currentAPIUserRole = 'admin';
            await deleteBalanceTransaction();
          });
        });
      });
    });
    context('db access denied', () => {
      it('should throw an error', async () => {
        dbServiceAccessOptions.isCurrentAPIUserPermitted = false;
        try {
          await deleteBalanceTransaction();
        } catch (err: any) {
          expect(err.message).to.equal('Access denied.');
        }
      });
    });
  });
});
