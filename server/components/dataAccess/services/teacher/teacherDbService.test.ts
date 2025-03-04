import { expect } from 'chai';
import { makeTeacherDbService } from '.';
import { AppointmentDoc } from '../../../../models/Appointment';
import { PackageTransactionDoc } from '../../../../models/PackageTransaction';
import { TeacherDoc } from '../../../../models/Teacher';
import { JoinedUserDoc } from '../../../../models/User';
import { DbServiceAccessOptions } from '../../abstractions/IDbService';
import { makeFakeDbAppointmentFactory } from '../../testFixtures/fakeDbAppointmentFactory';
import { FakeDbAppointmentFactory } from '../../testFixtures/fakeDbAppointmentFactory/fakeDbAppointmentFactory';
import { makeFakeDbPackageTransactionFactory } from '../../testFixtures/fakeDbPackageTransactionFactory';
import { FakeDbPackageTransactionFactory } from '../../testFixtures/fakeDbPackageTransactionFactory/fakeDbPackageTransactionFactory';
import { makeFakeDbUserFactory } from '../../testFixtures/fakeDbUserFactory';
import { FakeDbUserFactory } from '../../testFixtures/fakeDbUserFactory/fakeDbUserFactory';
import { makeAppointmentDbService } from '../appointment';
import { AppointmentDbService } from '../appointment/appointmentDbService';
import { makePackageTransactionDbService } from '../packageTransaction';
import { PackageTransactionDbService } from '../packageTransaction/packageTransactionDbService';
import { makeUserDbService } from '../user';
import { UserDbService } from '../user/userDbService';
import { TeacherDbService } from './teacherDbService';

let userDbService: UserDbService;
let teacherDbService: TeacherDbService;
let packageTransactionDbService: PackageTransactionDbService;
let appointmentDbService: AppointmentDbService;
let dbServiceAccessOptions: DbServiceAccessOptions;
let fakeDbUserFactory: FakeDbUserFactory;
let fakeDbPackageTransactionFactory: FakeDbPackageTransactionFactory;
let fakeDbAppointmentFactory: FakeDbAppointmentFactory;
let fakeUser: JoinedUserDoc;
let fakeTeacher: JoinedUserDoc;
let fakePackageTransaction: PackageTransactionDoc;
let fakeAppointment: AppointmentDoc;

before(async () => {
  userDbService = await makeUserDbService;
  teacherDbService = await makeTeacherDbService;
  packageTransactionDbService = await makePackageTransactionDbService;
  appointmentDbService = await makeAppointmentDbService;
  fakeDbUserFactory = await makeFakeDbUserFactory;
  fakeDbPackageTransactionFactory = await makeFakeDbPackageTransactionFactory;
  fakeDbAppointmentFactory = await makeFakeDbAppointmentFactory;
});

beforeEach(async () => {
  dbServiceAccessOptions = userDbService.getBaseDbServiceAccessOptions();
  fakeUser = await fakeDbUserFactory.createFakeDbUser();
  fakeTeacher = await fakeDbUserFactory.createFakeDbTeacher();
  fakePackageTransaction = await fakeDbPackageTransactionFactory.createFakeDbData({
    hostedById: fakeTeacher._id,
    reservedById: fakeUser._id,
    packageId: fakeTeacher.teacherData!.packages[0]._id,
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

describe('teacherDbService', () => {
  describe('findById, findOne, find', () => {
    context('db access permitted', () => {
      context('invalid inputs', () => {
        it('should throw an error if given an invalid id', async () => {
          try {
            await teacherDbService.findById({
              _id: undefined,
              dbServiceAccessOptions,
            });
          } catch (err) {
            expect(err).be.an('error');
          }
        });
        it('should return null if given an non-existent id', async () => {
          const findByIdTeacher = await teacherDbService.findById({
            _id: '60979db0bb31ed001589a1ea',
            dbServiceAccessOptions,
          });
          expect(findByIdTeacher).to.equal(null);
        });
      });
      context('valid inputs', () => {
        const getTeacher = async () => {
          const findParams = {
            searchQuery: {
              _id: fakeTeacher.teacherData!._id,
            },
            dbServiceAccessOptions,
          };
          const findByIdTeacher = (await teacherDbService.findById({
            _id: fakeTeacher.teacherData!._id,
            dbServiceAccessOptions,
          })) as TeacherDoc;
          const findByIdTeacherCache = (await teacherDbService.findById({
            _id: fakeTeacher.teacherData!._id,
            dbServiceAccessOptions,
          })) as TeacherDoc;
          const findOneTeacher = (await teacherDbService.findOne(findParams)) as TeacherDoc;
          const findTeachers = (await teacherDbService.find(findParams)) as TeacherDoc[];
          expect(findByIdTeacher.tags).to.deep.equal(findByIdTeacherCache.tags);
          expect(findByIdTeacher.tags).to.deep.equal(findOneTeacher.tags);
          expect(findByIdTeacher).to.deep.equal(findTeachers[0]);
          return findByIdTeacher;
        };
        context('as a non-admin user', () => {
          context('viewing self', () => {
            it('should find the teacher and return an unrestricted view', async () => {
              dbServiceAccessOptions.isSelf = true;
              const findByIdTeacher = await getTeacher();
              expect(findByIdTeacher).to.have.property('licenseUrl');
            });
          });
          context('viewing other', () => {
            it('should find the teacher and return an restricted view', async () => {
              const findByIdTeacher = await getTeacher();
              expect(findByIdTeacher).to.not.have.property('licenseUrl');
            });
          });
        });
        context('as an admin', () => {
          it('should find the teacher and return an unrestricted view', async () => {
            dbServiceAccessOptions.currentAPIUserRole = 'admin';
            const findByIdTeacher = await getTeacher();
            expect(findByIdTeacher).to.have.property('licenseUrl');
          });
        });
      });
    });
    context('db access denied', () => {
      it('should throw an error', async () => {
        dbServiceAccessOptions.isCurrentAPIUserPermitted = false;
        try {
          const findByIdTeacher = await teacherDbService.findById({
            _id: fakeTeacher.teacherData!._id,
            dbServiceAccessOptions,
          });
        } catch (err: any) {
          expect(err.message).to.equal('Access denied.');
        }
      });
    });
  });
  describe('insert', () => {
    it('should throw an error', async () => {
      dbServiceAccessOptions.isCurrentAPIUserPermitted = false;
      const { ...modelToInsert } = fakeTeacher.teacherData;
      try {
        await teacherDbService.insert({
          modelToInsert,
          dbServiceAccessOptions,
        });
      } catch (err) {
        expect(err).to.be.an('error');
      }
    });
  });
  describe('update', () => {
    const updateTeacher = async () => {
      const overrideDbServiceAccessOptions =
        appointmentDbService.getOverrideDbServiceAccessOptions();
      const updatedTeacher = <TeacherDoc>await teacherDbService.findOneAndUpdate({
        searchQuery: { _id: fakeTeacher.teacherData!._id },
        updateQuery: { studentCount: 5 },
        dbServiceAccessOptions,
      });
      const findAppointment = await appointmentDbService.findOne({
        searchQuery: {
          hostedById: fakeTeacher._id,
        },
        dbServiceAccessOptions: overrideDbServiceAccessOptions,
      });
      const findPackageTransaction = await packageTransactionDbService.findOne({
        searchQuery: {
          hostedById: fakeTeacher._id,
        },
        dbServiceAccessOptions,
      });
      expect(findPackageTransaction.hostedByData.teacherData!.studentCount).to.equal(5);
      expect(updatedTeacher).to.not.deep.equal(fakeTeacher);
      expect(updatedTeacher.studentCount).to.equal(5);
      expect(
        findAppointment.packageTransactionData.hostedByData.teacherData!.studentCount
      ).to.equal(5);
      return updatedTeacher;
    };
    context('db access permitted', () => {
      context('invalid inputs', () => {
        it('should return the original teacher if update field does not exist', async () => {
          const updatedTeacher = await teacherDbService.findOneAndUpdate({
            searchQuery: {
              _id: fakeTeacher.teacherData!._id,
            },
            updateQuery: {
              nonExistentField: 'some non-existent field',
            },
            dbServiceAccessOptions,
          });
          expect(updatedTeacher).to.deep.equal(fakeTeacher.teacherData);
          return updatedTeacher;
        });
        it('should return null if the teacher to update does not exist', async () => {
          const updatedTeacher = await teacherDbService.findOneAndUpdate({
            searchQuery: {
              _id: fakeTeacher.teacherData!.packages[0]._id,
            },
            updateQuery: { studentCount: 5 },
            dbServiceAccessOptions,
          });
          expect(updatedTeacher).to.equal(null);
        });
      });
      context('valid inputs', () => {
        context('as a non-admin user', () => {
          context('updating self', () => {
            it('should update the teacher', async () => {
              dbServiceAccessOptions.isSelf = true;
              const updatedTeacher = await updateTeacher();
              expect(updatedTeacher).to.have.property('licenseUrl');
            });
          });
          context('updating other', async () => {
            it('should update the teacher', async () => {
              const updatedTeacher = await updateTeacher();
              expect(updatedTeacher).to.not.have.property('licenseUrl');
            });
          });
        });
        context('as an admin', async () => {
          it('should update the teacher', async () => {
            dbServiceAccessOptions.currentAPIUserRole = 'admin';
            const updatedTeacher = await updateTeacher();
            expect(updatedTeacher).to.have.property('licenseUrl');
          });
        });
      });
    });
    context('db access denied', () => {
      it('should throw an error', async () => {
        dbServiceAccessOptions.isCurrentAPIUserPermitted = false;
        try {
          await updateTeacher();
        } catch (err: any) {
          expect(err.message).to.equal('Access denied.');
        }
      });
    });
  });
  describe('delete', () => {
    const deleteTeacher = async () => {
      const foundUserBefore = await userDbService.findById({
        _id: fakeTeacher._id,
        dbServiceAccessOptions,
      });
      const deletedTeacher = await teacherDbService.findByIdAndDelete({
        _id: fakeTeacher.teacherData!._id,
        dbServiceAccessOptions,
      });
      const foundTeacher = await teacherDbService.findById({
        _id: fakeTeacher.teacherData!._id,
        dbServiceAccessOptions,
      });
      const foundUser = await userDbService.findById({
        _id: fakeTeacher._id,
        dbServiceAccessOptions,
      });
      expect(deletedTeacher).to.not.deep.equal(foundTeacher);
      expect(foundTeacher).to.be.equal(null);
      expect(foundUser).to.not.equal(null);
    };
    context('db access permitted', () => {
      context('invalid inputs', () => {
        it('should return null if the teacher to delete does not exist', async () => {
          const deletedTeacher = await teacherDbService.findByIdAndDelete({
            _id: fakeTeacher.teacherData!.packages[0]._id,
            dbServiceAccessOptions,
          });
          expect(deletedTeacher).to.equal(null);
        });
      });
      context('valid inputs', () => {
        context('as a non-admin user', () => {
          context('deleting self', () => {
            it('should update the package', async () => {
              dbServiceAccessOptions.isSelf = true;
              await deleteTeacher();
            });
          });
          context('deleting other', async () => {
            it('should update the package', async () => {
              await deleteTeacher();
            });
          });
        });
        context('as an admin', async () => {
          it('should update the package', async () => {
            dbServiceAccessOptions.currentAPIUserRole = 'admin';
            await deleteTeacher();
          });
        });
      });
    });
    context('db access denied', () => {
      it('should throw an error', async () => {
        dbServiceAccessOptions.isCurrentAPIUserPermitted = false;
        try {
          await deleteTeacher();
        } catch (err: any) {
          expect(err.message).to.equal('Access denied.');
        }
      });
    });
  });
});
