import {
  ContentEntityBuildParams,
  ContentEntityBuildResponse,
  CONTENT_ENTITY_OWNERSHIP,
  CONTENT_ENTITY_TYPE,
} from '../../../entities/content/contentEntity';
import { ContentDbServiceResponse } from '../../services/content/contentDbService';
import { AbstractFakeDbDataFactory } from '../abstractions/AbstractFakeDbDataFactory';

type OptionalFakeDbContentFactoryInitParams = {};

class FakeDbContentFactory extends AbstractFakeDbDataFactory<
  OptionalFakeDbContentFactoryInitParams,
  ContentEntityBuildParams,
  ContentEntityBuildResponse,
  ContentDbServiceResponse
> {
  protected _createFakeBuildParams = async (): Promise<ContentEntityBuildParams> => {
    const fakeBuildParams = {
      postedById: '605bc5ad9db900001528f77c' as any,
      collectionId: '605bc5ad9db900001528f77c' as any,
      title: 'test',
      coverImageUrl: 'https://google.com/',
      sourceUrl: 'https://google.com/',
      summary: 'summary',
      entities: [],
      tokens: ['token'],
      categories: ['science'],
      ownership: CONTENT_ENTITY_OWNERSHIP.PRIVATE,
      author: 'wikipedia',
      type: CONTENT_ENTITY_TYPE.WIKIPEDIA,
    };
    return fakeBuildParams;
  };
}

export { FakeDbContentFactory };
