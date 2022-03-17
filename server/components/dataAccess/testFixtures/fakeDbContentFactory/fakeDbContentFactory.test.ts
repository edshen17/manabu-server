import { expect } from 'chai';
import { makeFakeDbContentFactory } from '.';
import { ContentDoc } from '../../../../models/Content';
import { DbServiceAccessOptions } from '../../abstractions/IDbService';
import { makeContentDbService } from '../../services/content';
import { ContentDbService } from '../../services/content/contentDbService';
import { FakeDbContentFactory } from './fakeDbContentFactory';

let fakeDbContentFactory: FakeDbContentFactory;
let fakeContent: ContentDoc;
let contentDbService: ContentDbService;
let dbServiceAccessOptions: DbServiceAccessOptions;

before(async () => {
  fakeDbContentFactory = await makeFakeDbContentFactory;
  contentDbService = await makeContentDbService;
  dbServiceAccessOptions = contentDbService.getOverrideDbServiceAccessOptions();
});

beforeEach(async () => {
  fakeContent = await fakeDbContentFactory.createFakeDbData();
  fakeContent = await contentDbService.findById({
    _id: fakeContent._id,
    dbServiceAccessOptions,
  });
});

describe('fakeDbContentFactory', () => {
  describe('createFakeDbData', () => {
    it('should create a fake incomeReport', async () => {
      expect(fakeContent.tokens.length > 0).to.equal(true);
    });
  });
});
