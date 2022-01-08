import { expect } from 'chai';
import { makeIncomeReportDbService } from '.';
import { IncomeReportDoc } from '../../../../models/IncomeReport';
import { DbServiceAccessOptions } from '../../abstractions/IDbService';
import { makeFakeDbIncomeReportFactory } from '../../testFixtures/fakeDbIncomeReportFactory';
import { FakeDbIncomeReportFactory } from '../../testFixtures/fakeDbIncomeReportFactory/fakeDbIncomeReportFactory';
import { IncomeReportDbService } from './incomeReportDbService';

let incomeReportDbService: IncomeReportDbService;
let fakeDbIncomeReportFactory: FakeDbIncomeReportFactory;
let dbServiceAccessOptions: DbServiceAccessOptions;
let fakeIncomeReport: IncomeReportDoc;

before(async () => {
  incomeReportDbService = await makeIncomeReportDbService;
  fakeDbIncomeReportFactory = await makeFakeDbIncomeReportFactory;
});

beforeEach(async () => {
  dbServiceAccessOptions = incomeReportDbService.getBaseDbServiceAccessOptions();
  fakeIncomeReport = await fakeDbIncomeReportFactory.createFakeDbData();
});

describe('incomeReportDbService', () => {
  describe('findById, findOne, find', () => {
    context('db access permitted', () => {
      context('invalid inputs', () => {
        it('should throw an error if given an invalid id', async () => {
          try {
            await incomeReportDbService.findById({
              _id: undefined,
              dbServiceAccessOptions,
            });
          } catch (err) {
            expect(err).be.an('error');
          }
        });
        it('should return null if given an non-existent id', async () => {
          const findByIdIncomeReport = await incomeReportDbService.findById({
            _id: '60979db0bb31ed001589a1ea',
            dbServiceAccessOptions,
          });
          expect(findByIdIncomeReport).to.equal(null);
        });
      });
      context('valid inputs', () => {
        const getIncomeReport = async () => {
          const findParams = {
            searchQuery: {
              _id: fakeIncomeReport._id,
            },
            dbServiceAccessOptions,
          };
          const findByIdIncomeReport = await incomeReportDbService.findById({
            _id: fakeIncomeReport._id,
            dbServiceAccessOptions,
          });
          const findOneIncomeReport = await incomeReportDbService.findOne(findParams);
          const findIncomeReports = await incomeReportDbService.find(findParams);
          expect(findByIdIncomeReport).to.deep.equal(findOneIncomeReport);
          expect(findByIdIncomeReport).to.deep.equal(findIncomeReports[0]);
        };
        context('as a non-admin user', () => {
          context('viewing self', () => {
            it('should return a restricted view on some data', async () => {
              dbServiceAccessOptions.isSelf = true;
              await getIncomeReport();
            });
          });
          context('viewing other', () => {
            it('should return a restricted view on some data', async () => {
              await getIncomeReport();
            });
          });
        });
        context('as an admin', () => {
          it('should find the IncomeReport and return an unrestricted view on some data', async () => {
            dbServiceAccessOptions.currentAPIUserRole = 'admin';
            await getIncomeReport();
          });
        });
      });
    });
    context('db access denied', () => {
      it('should throw an error', async () => {
        dbServiceAccessOptions.isCurrentAPIUserPermitted = false;
        let err;
        try {
          err = await incomeReportDbService.findById({
            _id: fakeIncomeReport._id,
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
            fakeIncomeReport = await incomeReportDbService.insert({
              modelToInsert: {},
              dbServiceAccessOptions,
            });
          } catch (err) {
            expect(err).to.be.an('error');
          }
        });
      });
      context('valid inputs', () => {
        it('should insert an IncomeReport', async () => {
          const findByIdIncomeReport = await incomeReportDbService.findById({
            _id: fakeIncomeReport._id,
            dbServiceAccessOptions,
          });
          expect(findByIdIncomeReport).to.not.equal(null);
          expect(findByIdIncomeReport).to.deep.equal(fakeIncomeReport);
        });
      });
    });
    context('db access denied', () => {
      it('should throw an error', async () => {
        dbServiceAccessOptions.isCurrentAPIUserPermitted = false;
        const { _id, ...modelToInsert } = fakeIncomeReport;
        try {
          fakeIncomeReport = await incomeReportDbService.insert({
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
    const updateIncomeReport = async () => {
      const updatedIncomeReport = await incomeReportDbService.findOneAndUpdate({
        searchQuery: { _id: fakeIncomeReport._id },
        updateQuery: { startDate: new Date() },
        dbServiceAccessOptions,
      });
      expect(updatedIncomeReport).to.not.deep.equal(fakeIncomeReport);
    };
    context('db access permitted', () => {
      context('invalid inputs', () => {
        it('should return null if the incomeReport to update does not exist', async () => {
          const updatedIncomeReport = await incomeReportDbService.findOneAndUpdate({
            searchQuery: {
              _id: '60979db0bb31ed001589a1ea',
            },
            updateQuery: { status: 'cancelled' },
            dbServiceAccessOptions,
          });
          expect(updatedIncomeReport).to.equal(null);
        });
      });
      context('valid inputs', () => {
        context('as a non-admin user', () => {
          context('updating self', () => {
            it('should update the incomeReport', async () => {
              dbServiceAccessOptions.isSelf = true;
              await updateIncomeReport();
            });
          });
          context('updating other', async () => {
            it('should update the incomeReport', async () => {
              await updateIncomeReport();
            });
          });
        });
        context('as an admin', async () => {
          it('should update the incomeReport', async () => {
            dbServiceAccessOptions.currentAPIUserRole = 'admin';
            await updateIncomeReport();
          });
        });
      });
    });
    context('db access denied', () => {
      it('should throw an error', async () => {
        dbServiceAccessOptions.isCurrentAPIUserPermitted = false;
        try {
          await updateIncomeReport();
        } catch (err: any) {
          expect(err.message).to.equal('Access denied.');
        }
      });
    });
  });
  describe('delete', () => {
    const deleteIncomeReport = async () => {
      const deletedIncomeReport = await incomeReportDbService.findByIdAndDelete({
        _id: fakeIncomeReport._id,
        dbServiceAccessOptions,
      });
      const foundIncomeReport = await incomeReportDbService.findById({
        _id: fakeIncomeReport._id,
        dbServiceAccessOptions,
      });
      expect(foundIncomeReport).to.not.deep.equal(deletedIncomeReport);
      expect(foundIncomeReport).to.be.equal(null);
    };
    context('db access permitted', () => {
      context('invalid inputs', () => {
        it('should return null if the incomeReport to delete does not exist', async () => {
          const deletedIncomeReport = await incomeReportDbService.findByIdAndDelete({
            _id: '60979db0bb31ed001589a1ea',
            dbServiceAccessOptions,
          });
          expect(deletedIncomeReport).to.equal(null);
        });
      });
      context('valid inputs', () => {
        context('as a non-admin user', () => {
          context('deleting self', () => {
            it('should delete the incomeReport', async () => {
              dbServiceAccessOptions.isSelf = true;
              await deleteIncomeReport();
            });
          });
          context('deleting other', async () => {
            it('should update the incomeReport', async () => {
              await deleteIncomeReport();
            });
          });
        });
        context('as an admin', async () => {
          it('should update the incomeReport', async () => {
            dbServiceAccessOptions.currentAPIUserRole = 'admin';
            await deleteIncomeReport();
          });
        });
      });
    });
    context('db access denied', () => {
      it('should throw an error', async () => {
        dbServiceAccessOptions.isCurrentAPIUserPermitted = false;
        try {
          await deleteIncomeReport();
        } catch (err: any) {
          expect(err.message).to.equal('Access denied.');
        }
      });
    });
  });
});
