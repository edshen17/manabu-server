import { expect } from 'chai';
import { makeTeacherBalanceDbService } from '.';
import { TeacherBalanceDoc } from '../../../../models/TeacherBalance';
import { JoinedUserDoc } from '../../../../models/User';
import { DbServiceAccessOptions } from '../../abstractions/IDbService';
import { makeFakeDbTeacherBalanceFactory } from '../../testFixtures/fakeDbTeacherBalanceFactory';
import { FakeDbTeacherBalanceFactory } from '../../testFixtures/fakeDbTeacherBalanceFactory/fakeDbTeacherBalanceFactory';
import { makeFakeDbUserFactory } from '../../testFixtures/fakeDbUserFactory';
import { FakeDbUserFactory } from '../../testFixtures/fakeDbUserFactory/fakeDbUserFactory';
import { TeacherBalanceDbService } from './teacherBalanceDbService';

let teacherBalanceDbService: TeacherBalanceDbService;
let fakeDbTeacherBalanceFactory: FakeDbTeacherBalanceFactory;
let fakeDbUserFactory: FakeDbUserFactory;
let fakeTeacher: JoinedUserDoc;
let dbServiceAccessOptions: DbServiceAccessOptions;
let fakeTeacherBalance: TeacherBalanceDoc;

before(async () => {
  teacherBalanceDbService = await makeTeacherBalanceDbService;
  fakeDbTeacherBalanceFactory = await makeFakeDbTeacherBalanceFactory;
  fakeDbUserFactory = await makeFakeDbUserFactory;
});

beforeEach(async () => {
  dbServiceAccessOptions = teacherBalanceDbService.getBaseDbServiceAccessOptions();
  fakeTeacher = await fakeDbUserFactory.createFakeDbTeacherWithDefaultPackages();
  fakeTeacherBalance = await fakeDbTeacherBalanceFactory.createFakeDbData({
    userId: fakeTeacher._id,
  });
});

describe('teacherBalanceService', () => {
  describe('findById, findOne, find', () => {
    context('db access permitted', () => {
      context('invalid inputs', () => {
        it('should throw an error if given an invalid id', async () => {
          try {
            await teacherBalanceDbService.findById({
              _id: undefined,
              dbServiceAccessOptions,
            });
          } catch (err) {
            expect(err).be.an('error');
          }
        });
        it('should return null if given an non-existent id', async () => {
          const findByIdTeacherBalance = await teacherBalanceDbService.findById({
            _id: '60979db0bb31ed001589a1ea',
            dbServiceAccessOptions,
          });
          expect(findByIdTeacherBalance).to.equal(null);
        });
      });
      context('valid inputs', () => {
        const getTeacherBalance = async () => {
          const findParams = {
            searchQuery: {
              _id: fakeTeacherBalance._id,
            },
            dbServiceAccessOptions,
          };
          const findByIdTeacherBalance = await teacherBalanceDbService.findById({
            _id: fakeTeacherBalance._id,
            dbServiceAccessOptions,
          });
          const findOneTeacherBalance = await teacherBalanceDbService.findOne(findParams);
          const findTeacherBalances = await teacherBalanceDbService.find(findParams);
          expect(findByIdTeacherBalance).to.deep.equal(findOneTeacherBalance);
          expect(findByIdTeacherBalance).to.deep.equal(findTeacherBalances[0]);
        };
        context('as a non-admin user', () => {
          context('viewing self', () => {
            it('should find the teacherBalance and return an unrestricted view', async () => {
              dbServiceAccessOptions.isSelf = true;
              await getTeacherBalance();
            });
          });
          context('viewing other', () => {
            it('should find the teacherBalance and return an unrestricted view', async () => {
              await getTeacherBalance();
            });
          });
        });
        context('as an admin', () => {
          it('should find the teacherBalance and return an unrestricted view', async () => {
            dbServiceAccessOptions.isSelf = true;
            await getTeacherBalance();
          });
        });
      });
    });
    context('db access denied', () => {
      it('should throw an error', async () => {
        dbServiceAccessOptions.isCurrentAPIUserPermitted = false;
        try {
          const findByIdTeacherBalance = await teacherBalanceDbService.findById({
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
            const fakeTeacherBalance = await teacherBalanceDbService.insert({
              modelToInsert: {},
              dbServiceAccessOptions,
            });
          } catch (err) {
            expect(err).to.be.an('error');
          }
        });
      });
      context('valid inputs', () => {
        it('should insert a new teacherBalance', async () => {
          const findTeacherBalance = await teacherBalanceDbService.findById({
            _id: fakeTeacherBalance._id,
            dbServiceAccessOptions,
          });
          expect(fakeTeacherBalance).to.not.equal(null);
          expect(findTeacherBalance).to.deep.equal(fakeTeacherBalance);
        });
      });
    });
    context('db access denied', () => {
      it('should throw an error', async () => {
        dbServiceAccessOptions.isCurrentAPIUserPermitted = false;
        const { _id, ...modelToInsert } = fakeTeacherBalance;
        try {
          fakeTeacherBalance = await teacherBalanceDbService.insert({
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
    const updateTeacherBalance = async () => {
      const updatedTeacherBalance = await teacherBalanceDbService.findOneAndUpdate({
        searchQuery: { _id: fakeTeacherBalance._id },
        updateQuery: { balance: 5 },
        dbServiceAccessOptions,
      });
      expect(updatedTeacherBalance).to.not.deep.equal(fakeTeacherBalance);
      expect(updatedTeacherBalance.balance).to.equal(5);
    };
    context('db access permitted', () => {
      context('invalid inputs', () => {
        it('should return the original teacherBalance if update field does not exist', async () => {
          const updatedTeacherBalance = await teacherBalanceDbService.findOneAndUpdate({
            searchQuery: { _id: fakeTeacherBalance._id },
            updateQuery: {
              nonExistentField: 'some non-existent field',
            },
            dbServiceAccessOptions,
          });
          expect(updatedTeacherBalance).to.deep.equal(fakeTeacherBalance);
        });
        it('should return null if the teacherBalance to update does not exist', async () => {
          const updatedTeacherBalance = await teacherBalanceDbService.findOneAndUpdate({
            searchQuery: {
              _id: fakeTeacherBalance.userId,
            },
            updateQuery: { 'balanceDetails.balance': 5 },
            dbServiceAccessOptions,
          });
          expect(updatedTeacherBalance).to.equal(null);
        });
      });
      context('valid inputs', () => {
        context('as a non-admin user', () => {
          context('updating self', () => {
            it('should update the teacherBalance', async () => {
              dbServiceAccessOptions.isSelf = true;
              await updateTeacherBalance();
            });
          });
          context('updating other', async () => {
            it('should update the teacherBalance', async () => {
              await updateTeacherBalance();
            });
          });
        });
        context('as an admin', async () => {
          it('should update the teacherBalance', async () => {
            dbServiceAccessOptions.currentAPIUserRole = 'admin';
            await updateTeacherBalance();
          });
        });
      });
    });
    context('db access denied', () => {
      it('should throw an error', async () => {
        dbServiceAccessOptions.isCurrentAPIUserPermitted = false;
        try {
          await updateTeacherBalance();
        } catch (err: any) {
          expect(err.message).to.equal('Access denied.');
        }
      });
    });
  });
  describe('delete', () => {
    const deleteTeacherBalance = async () => {
      const deletedTeacherBalance = await teacherBalanceDbService.findByIdAndDelete({
        _id: fakeTeacherBalance._id,
        dbServiceAccessOptions,
      });
      const foundTeacherBalance = await teacherBalanceDbService.findById({
        _id: fakeTeacherBalance._id,
        dbServiceAccessOptions,
      });
      expect(foundTeacherBalance).to.not.deep.equal(deletedTeacherBalance);
      expect(foundTeacherBalance).to.be.equal(null);
    };
    context('db access permitted', () => {
      context('invalid inputs', () => {
        it('should return null if the teacherBalance to delete does not exist', async () => {
          const deletedTeacherBalance = await teacherBalanceDbService.findByIdAndDelete({
            _id: fakeTeacherBalance.userId,
            dbServiceAccessOptions,
          });
          expect(deletedTeacherBalance).to.equal(null);
        });
      });
      context('valid inputs', () => {
        context('as a non-admin user', () => {
          context('deleting self', () => {
            it('should update the teacherBalance', async () => {
              dbServiceAccessOptions.isSelf = true;
              await deleteTeacherBalance();
            });
          });
          context('deleting other', async () => {
            it('should update the teacherBalance', async () => {
              await deleteTeacherBalance();
            });
          });
        });
        context('as an admin', async () => {
          it('should update the teacherBalance', async () => {
            dbServiceAccessOptions.currentAPIUserRole = 'admin';
            await deleteTeacherBalance();
          });
        });
      });
    });
    context('db access denied', () => {
      it('should throw an error', async () => {
        dbServiceAccessOptions.isCurrentAPIUserPermitted = false;
        try {
          await deleteTeacherBalance();
        } catch (err: any) {
          expect(err.message).to.equal('Access denied.');
        }
      });
    });
  });
});

describe('teacherBalanceDbService', () => {
  describe('findById, findOne, find', () => {
    it('should find a teacherBalance from the given search query', async () => {
      const findOneTeacherBalance = await teacherBalanceDbService.findOne({
        searchQuery: { userId: fakeTeacher._id },
        dbServiceAccessOptions,
      });
      const findTeacherBalances = await teacherBalanceDbService.find({
        searchQuery: { userId: fakeTeacher._id },
        dbServiceAccessOptions,
      });
      const findByIdTeacherBalance = await teacherBalanceDbService.findById({
        _id: findOneTeacherBalance._id,
        dbServiceAccessOptions,
      });
      expect(findOneTeacherBalance).to.deep.equal(fakeTeacherBalance);
      expect(findOneTeacherBalance).to.deep.equal(findTeacherBalances[0]);
      expect(findOneTeacherBalance).to.deep.equal(findByIdTeacherBalance);
    });
  });
  describe('insert', async () => {
    it('should insert a new teacherBalanceTransaction', async () => {
      expect(fakeTeacherBalance).to.not.equal(null);
      const findByIdTeacherBalance = await teacherBalanceDbService.findById({
        _id: fakeTeacherBalance._id,
        dbServiceAccessOptions,
      });
    });
  });
  describe('update', () => {
    it('should update the teacherBalanceTransaction', async () => {
      expect(fakeTeacherBalance.balance).to.equal(0);
      const updatedTeacherBalance = await teacherBalanceDbService.findOneAndUpdate({
        searchQuery: { userId: fakeTeacher._id },
        updateQuery: { balance: 10 },
        dbServiceAccessOptions,
      });
      expect(updatedTeacherBalance.balance).to.equal(10);
    });
  });
});
