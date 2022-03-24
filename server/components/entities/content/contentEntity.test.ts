import { expect } from 'chai';
import faker from 'faker';
import { makeContentEntity } from '.';
import { ContentEntity, CONTENT_ENTITY_OWNERSHIP, CONTENT_ENTITY_TYPE } from './contentEntity';

let contentEntity: ContentEntity;

before(async () => {
  contentEntity = await makeContentEntity;
});

describe('contentEntity', () => {
  describe('build', () => {
    context('given valid inputs', () => {
      it('should create an contentEntity', async () => {
        const content = await contentEntity.build({
          language: 'ja',
          postedById: '605bc5ad9db900001528f77c' as any,
          collectionId: '605bc5ad9db900001528f77c' as any,
          title: 'test',
          rawContent: 'something',
          coverImageUrl: faker.image.dataUri(),
          sourceUrl: faker.image.dataUri(),
          summary: 'summary',
          entities: [],
          tokens: [
            {
              text: 'token',
              partOfSpeech: 'PUNCT',
            },
          ],
          categories: ['science'],
          ownership: CONTENT_ENTITY_OWNERSHIP.PRIVATE,
          author: 'wikipedia',
          type: CONTENT_ENTITY_TYPE.WIKIPEDIA,
        });
        expect(content.author).to.equal('wikipedia');
      });
    });
  });
});
