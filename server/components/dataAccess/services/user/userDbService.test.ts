import { expect } from 'chai';
import { isEqual } from 'lodash';
import { DbServiceAccessOptions } from '../../abstractions/IDbService';
import { JoinedUserDoc, UserDbService } from './userDbService';
import { makeUserDbService } from '.';
import { makeFakeDbUserFactory } from '../../testFixtures/fakeDbUserFactory';
import { FakeDbUserFactory } from '../../testFixtures/fakeDbUserFactory/fakeDbUserFactory';

let userDbService: UserDbService;
let fakeDbUserFactory: FakeDbUserFactory;
let dbServiceAccessOptions: DbServiceAccessOptions;
let newUser: JoinedUserDoc;
let newTeacher: JoinedUserDoc;
before(async () => {
  userDbService = await makeUserDbService;
  fakeDbUserFactory = await makeFakeDbUserFactory;
  newUser = await fakeDbUserFactory.createFakeDbUser();
  newTeacher = await fakeDbUserFactory.createFakeDbTeacherWithDefaultPackages();
});

beforeEach(async () => {
  dbServiceAccessOptions = fakeDbUserFactory.getDbServiceAccessOptions();
});

describe('userDbService', () => {
  describe('findById, findOne, find', () => {
    context('db access permitted', () => {
      context('bad input', () => {
        it('should throw an error if given an invalid id', async () => {
          try {
            await userDbService.findById({
              _id: undefined,
              dbServiceAccessOptions,
            });
          } catch (err) {
            expect(err).be.an('error');
          }
        });
        it('should throw an error given a non-existent user id', async () => {
          try {
            await userDbService.findById({
              _id: '60979db0bb31ed001589a1ea',
              dbServiceAccessOptions,
            });
          } catch (err) {
            expect(err).be.an('error');
            expect(err.message).to.equal('User not found');
          }
        });
      });
      context('valid input', () => {
        context('as a non-admin user', () => {
          context('viewing others', () => {
            it('should return a restricted view of another user', async () => {
              const findByIdUser = await userDbService.findById({
                _id: newUser._id,
                dbServiceAccessOptions,
              });
              const findOneUser = await userDbService.findOne({
                searchQuery: {
                  _id: newUser._id,
                },
                dbServiceAccessOptions,
              });
              const findUsers = await userDbService.find({
                searchQuery: {
                  _id: newUser._id,
                },
                dbServiceAccessOptions,
              });
              expect(isEqual(findByIdUser, findOneUser)).to.equal(true);
              expect(isEqual(findByIdUser, findUsers[0])).to.equal(true);
              expect(findByIdUser).to.not.have.property('email');
              expect(findByIdUser).to.not.have.property('password');
              expect(findByIdUser).to.not.have.property('verificationToken');
              expect(findByIdUser).to.not.have.property('settings');
              expect(findByIdUser).to.not.have.property('commMethods');
              expect(isEqual(newUser, findByIdUser)).to.equal(true);
            });
            it('should return a joined restricted view of another teacher', async () => {
              const searchTeacher = await userDbService.findById({
                _id: newTeacher._id,
                dbServiceAccessOptions,
              });
              expect(searchTeacher).to.have.property('teacherData');
              expect(searchTeacher.teacherData).to.have.property('packages');
              expect(searchTeacher.teacherData).to.not.have.property('licensePath');
              expect(searchTeacher).to.have.property('teacherAppPending');
              expect(searchTeacher).to.not.have.property('email');
              expect(searchTeacher).to.not.have.property('password');
              expect(searchTeacher).to.not.have.property('verificationToken');
              expect(searchTeacher).to.not.have.property('settings');
              expect(searchTeacher).to.not.have.property('commMethods');
              expect(isEqual(newTeacher, searchTeacher)).to.equal(true);
            });
          });
          context('viewing self', () => {
            it('should return a less restricted view of a user', async () => {
              dbServiceAccessOptions.isSelf = true;
              const searchUser = await userDbService.findById({
                _id: newUser._id,
                dbServiceAccessOptions,
              });
              expect(searchUser).to.not.have.property('password');
              expect(searchUser).to.not.have.property('verificationToken');
              expect(searchUser).to.have.property('email');
              expect(searchUser).to.have.property('settings');
              expect(searchUser).to.have.property('commMethods');
            });
            it('should return a less restricted view of a teacher', async () => {
              dbServiceAccessOptions.isSelf = true;
              const searchTeacher = await userDbService.findById({
                _id: newTeacher._id,
                dbServiceAccessOptions,
              });
              expect(searchTeacher.teacherData).to.have.property('licensePath');
            });
          });
          context('overriding default select view', () => {
            it('should return an user with the password field', async () => {
              dbServiceAccessOptions.isOverrideView = true;
              const searchUser = await userDbService.findById({
                _id: newUser._id,
                dbServiceAccessOptions,
              });

              expect(searchUser).to.have.property('password');
            });
          });
        });
        context('as an admin user', () => {
          it('should return additional restricted data', async () => {
            dbServiceAccessOptions.currentAPIUserRole = 'admin';
            const searchTeacher = await userDbService.findById({
              _id: newTeacher._id,
              dbServiceAccessOptions,
            });

            expect(searchTeacher.teacherData).to.have.property('licensePath');
            expect(searchTeacher).to.have.property('email');
            expect(searchTeacher).to.have.property('settings');
            expect(searchTeacher).to.have.property('commMethods');
            expect(searchTeacher).to.not.have.property('password');
            expect(searchTeacher).to.not.have.property('verificationToken');
          });
        });
      });
    });
    context('db access denied', () => {
      it('should throw an error', async () => {
        dbServiceAccessOptions.isCurrentAPIUserPermitted = false;
        try {
          const searchTeacher = await userDbService.findById({
            _id: newUser._id,
            dbServiceAccessOptions,
          });
        } catch (err) {
          expect(err).to.be.an('error');
          expect(err.message).to.equal('Access denied.');
        }
      });
    });
  });
  describe('insert', () => {
    context('db access permitted', () => {
      context('valid input', () => {
        it('should insert a new user into the db', async () => {
          const newUser = await fakeDbUserFactory.createFakeDbUser();
          const searchUser = await userDbService.findById({
            _id: newUser._id,
            dbServiceAccessOptions,
          });
          expect(isEqual(newUser, searchUser)).to.equal(true);
        });
      });
      context('invalid input', () => {
        it('should throw an error when creating a duplicate user', async () => {
          try {
            const dupeEntityData = {
              email: 'duplicateEmail@email.com',
            };
            const newUser = await fakeDbUserFactory.createFakeDbUser(dupeEntityData);
            const dupeUser = await fakeDbUserFactory.createFakeDbUser(dupeEntityData);
          } catch (err) {
            expect(err).be.an('error');
          }
        });
        it('should throw an error when required fields are not given', async () => {
          try {
            const dupeEntityData: any = {
              randomField: 'some-random-field',
            };
            const newUser = await fakeDbUserFactory.createFakeDbUser(dupeEntityData);
          } catch (err) {
            expect(err).be.an('error');
          }
        });
      });
    });
    context('db access denied', () => {
      it('should throw an error', async () => {
        try {
          dbServiceAccessOptions.isCurrentAPIUserPermitted = false;
          const entityData = {
            name: 'test',
            email: 'someEmail@email.test',
          };
          const newUser = await fakeDbUserFactory.createFakeDbUser(entityData);
        } catch (err) {
          expect(err).to.be.an('error');
          expect(err.message).to.equal('Access denied.');
        }
      });
    });
  });
  describe('update', async () => {
    const newTeacher = await fakeDbUserFactory.createFakeDbTeacherWithDefaultPackages();
    context('db access permitted', async () => {
      context('valid input', () => {
        context('as non-admin user', () => {
          context('updating self', () => {
            it('should update db document and return a less restricted view', async () => {
              dbServiceAccessOptions.isSelf = true;
              const updatedTeacher = await userDbService.findOneAndUpdate({
                searchQuery: { email: newTeacher.email },
                updateParams: { name: 'updated name' },
                dbServiceAccessOptions,
              });
              expect(updatedTeacher.name).to.equal('updated name');
              expect(updatedTeacher).to.have.property('email');
              expect(updatedTeacher).to.have.property('settings');
              expect(updatedTeacher).to.have.property('commTools');
              expect(updatedTeacher).to.not.have.property('password');
              expect(updatedTeacher).to.not.have.property('verficiationToken');
            });
          });
          context('updating others', () => {
            it('should update db document and return a restricted view', async () => {
              const updatedTeacher = await userDbService.findOneAndUpdate({
                searchQuery: { email: newTeacher.email },
                updateParams: { profileBio: 'updated bio' },
                dbServiceAccessOptions,
              });
              expect(updatedTeacher.profileBio).to.equal('updated bio');
              expect(updatedTeacher).to.not.have.property('email');
              expect(updatedTeacher).to.not.have.property('settings');
              expect(updatedTeacher).to.not.have.property('commTools');
              expect(updatedTeacher).to.not.have.property('password');
              expect(updatedTeacher).to.not.have.property('verficiationToken');
            });
          });
        });
        context('as admin', () => {
          it('should update db document and return a less restricted view', async () => {
            dbServiceAccessOptions.currentAPIUserRole = 'admin';
            const updatedTeacher = await userDbService.findOneAndUpdate({
              searchQuery: { email: newTeacher.email },
              updateParams: { profileImage: 'updated image' },
              dbServiceAccessOptions,
            });
            expect(updatedTeacher.teacherData).to.have.property('licensePath');
            expect(updatedTeacher.profileImage).to.equal('updated image');
            expect(updatedTeacher).to.have.property('email');
            expect(updatedTeacher).to.have.property('settings');
            expect(updatedTeacher).to.have.property('commTools');
            expect(updatedTeacher).to.not.have.property('password');
            expect(updatedTeacher).to.not.have.property('verficiationToken');
          });
        });
      });
      context('invalid input', () => {
        it('should throw an error', async () => {
          try {
            const updatedTeacher = await userDbService.findOneAndUpdate({
              searchQuery: { email: newTeacher.email },
              updateParams: { nonExistentField: 'some-non-existent-field' },
              dbServiceAccessOptions,
            });
          } catch (err) {
            expect(err).to.be.an('error');
          }
        });
      });
    });
    context('db access denied', () => {
      it('should throw an error', async () => {
        try {
          dbServiceAccessOptions.isCurrentAPIUserPermitted = false;
          const updatedTeacher = await userDbService.findOneAndUpdate({
            searchQuery: { email: newTeacher.email },
            updateParams: { profileImage: 'updated image' },
            dbServiceAccessOptions,
          });
        } catch (err) {
          expect(err.message).to.equal('Access denied.');
        }
      });
    });
  });
});
