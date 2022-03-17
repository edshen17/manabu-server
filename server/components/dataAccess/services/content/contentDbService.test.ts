import { expect } from 'chai';
import { makeContentDbService } from '.';
import { ContentDoc } from '../../../../models/Content';
import { DbServiceAccessOptions } from '../../abstractions/IDbService';
import { makeFakeDbContentFactory } from '../../testFixtures/fakeDbContentFactory';
import { FakeDbContentFactory } from '../../testFixtures/fakeDbContentFactory/fakeDbContentFactory';
import { ContentDbService } from './contentDbService';

let contentDbService: ContentDbService;
let fakeDbContentFactory: FakeDbContentFactory;
let dbServiceAccessOptions: DbServiceAccessOptions;
let fakeContent: ContentDoc;

before(async () => {
  contentDbService = await makeContentDbService;
  fakeDbContentFactory = await makeFakeDbContentFactory;
});

beforeEach(async () => {
  dbServiceAccessOptions = contentDbService.getBaseDbServiceAccessOptions();
  fakeContent = await fakeDbContentFactory.createFakeDbData();
});

describe('contentDbService', () => {
  describe('findById, findOne, find', () => {
    context('db access permitted', () => {
      context('invalid inputs', () => {
        it('should throw an error if given an invalid id', async () => {
          try {
            await contentDbService.findById({
              _id: undefined,
              dbServiceAccessOptions,
            });
          } catch (err) {
            expect(err).be.an('error');
          }
        });
        it('should return null if given an non-existent id', async () => {
          const findByIdContent = await contentDbService.findById({
            _id: '60979db0bb31ed001589a1ea',
            dbServiceAccessOptions,
          });
          expect(findByIdContent).to.equal(null);
        });
      });
      context('valid inputs', () => {
        const getContent = async () => {
          const findParams = {
            searchQuery: {
              _id: fakeContent._id,
            },
            dbServiceAccessOptions,
          };
          const findByIdContent = await contentDbService.findById({
            _id: fakeContent._id,
            dbServiceAccessOptions,
          });
          const findOneContent = await contentDbService.findOne(findParams);
          const findContent = await contentDbService.find(findParams);
          expect(findByIdContent).to.deep.equal(findOneContent);
          expect(findByIdContent).to.deep.equal(findContent[0]);
        };
        context('as a non-admin user', () => {
          context('viewing self', () => {
            it('should find the content and return an unrestricted view on some data', async () => {
              dbServiceAccessOptions.isSelf = true;
              await getContent();
            });
          });
          context('viewing other', () => {
            it('should find the content and return an unrestricted view on some data', async () => {
              await getContent();
            });
          });
        });
        context('as an admin', () => {
          it('should find the content and return an restricted view on some data', async () => {
            dbServiceAccessOptions.currentAPIUserRole = 'admin';
            await getContent();
          });
        });
      });
    });
    context('db access denied', () => {
      it('should throw an error', async () => {
        dbServiceAccessOptions.isCurrentAPIUserPermitted = false;
        let err;
        try {
          err = await contentDbService.findById({
            _id: fakeContent._id,
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
            fakeContent = await contentDbService.insert({
              modelToInsert: {},
              dbServiceAccessOptions,
            });
          } catch (err) {
            expect(err).to.be.an('error');
          }
        });
      });
      context('valid inputs', () => {
        it('should insert an Content', async () => {
          const findByIdContent = await contentDbService.findById({
            _id: fakeContent._id,
            dbServiceAccessOptions,
          });
          expect(findByIdContent).to.not.equal(null);
          expect(findByIdContent).to.deep.equal(fakeContent);
        });
      });
    });
    context('db access denied', () => {
      it('should throw an error', async () => {
        dbServiceAccessOptions.isCurrentAPIUserPermitted = false;
        const { _id, ...modelToInsert } = fakeContent;
        try {
          fakeContent = await contentDbService.insert({
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
    const updateContent = async () => {
      const updatedContent = await contentDbService.findOneAndUpdate({
        searchQuery: { _id: fakeContent._id },
        updateQuery: { title: 'new title' },
        dbServiceAccessOptions,
      });
      expect(updatedContent).to.not.deep.equal(fakeContent);
      expect(updatedContent.title).to.not.equal(fakeContent.title);
    };
    context('db access permitted', () => {
      context('invalid inputs', () => {
        it('should return null if the content to update does not exist', async () => {
          const updatedAvailableTime = await contentDbService.findOneAndUpdate({
            searchQuery: {
              _id: '605bc5ad9db900001528f77c',
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
            it('should update the content', async () => {
              dbServiceAccessOptions.isSelf = true;
              await updateContent();
            });
          });
          context('updating other', async () => {
            it('should update the content', async () => {
              await updateContent();
            });
          });
        });
        context('as an admin', async () => {
          it('should update the content', async () => {
            dbServiceAccessOptions.currentAPIUserRole = 'admin';
            await updateContent();
          });
        });
      });
    });
    context('db access denied', () => {
      it('should throw an error', async () => {
        dbServiceAccessOptions.isCurrentAPIUserPermitted = false;
        try {
          await updateContent();
        } catch (err: any) {
          expect(err.message).to.equal('Access denied.');
        }
      });
    });
  });
  describe('delete', () => {
    const deleteContent = async () => {
      const deletedAvailableTime = await contentDbService.findByIdAndDelete({
        _id: fakeContent._id,
        dbServiceAccessOptions,
      });
      const foundAvailableTime = await contentDbService.findById({
        _id: fakeContent._id,
        dbServiceAccessOptions,
      });
      expect(foundAvailableTime).to.not.deep.equal(deletedAvailableTime);
      expect(foundAvailableTime).to.be.equal(null);
    };
    context('db access permitted', () => {
      context('invalid inputs', () => {
        it('should return null if the content to delete does not exist', async () => {
          const deletedAvailableTime = await contentDbService.findByIdAndDelete({
            _id: '605bc5ad9db900001528f77c',
            dbServiceAccessOptions,
          });
          expect(deletedAvailableTime).to.equal(null);
        });
      });
      context('valid inputs', () => {
        context('as a non-admin user', () => {
          context('deleting self', () => {
            it('should update the content', async () => {
              dbServiceAccessOptions.isSelf = true;
              await deleteContent();
            });
          });
          context('deleting other', async () => {
            it('should update the content', async () => {
              await deleteContent();
            });
          });
        });
        context('as an admin', async () => {
          it('should update the content', async () => {
            dbServiceAccessOptions.currentAPIUserRole = 'admin';
            await deleteContent();
          });
        });
      });
    });
    context('db access denied', () => {
      it('should throw an error', async () => {
        dbServiceAccessOptions.isCurrentAPIUserPermitted = false;
        try {
          await deleteContent();
        } catch (err: any) {
          expect(err.message).to.equal('Access denied.');
        }
      });
    });
  });
});
