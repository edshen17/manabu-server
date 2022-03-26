import { ObjectId } from 'mongoose';
import { AbstractEntity } from '../abstractions/AbstractEntity';
import { NGramHandler } from '../utils/nGramHandler/nGramHandler';

type OptionalContentEntityInitParams = {
  makeNGramHandler: NGramHandler;
};

type ContentEntityBuildParams = Omit<
  ContentEntityBuildResponse,
  'createdDate' | 'lastModifiedDate' | 'titleNGrams'
>;

enum CONTENT_ENTITY_OWNERSHIP {
  PUBLIC = 'public',
  PRIVATE = 'private',
}

enum CONTENT_ENTITY_TYPE {
  WIKIPEDIA = 'wikipedia',
  ARTICLE = 'article',
  BOOK = 'book',
  VIDEO = 'video',
}

type ContentEntityBuildResponse = {
  postedById: ObjectId;
  collectionId?: ObjectId;
  title: string;
  titleNGrams: string;
  coverImageUrl: string;
  sourceUrl: string;
  summary?: string;
  tokens: string;
  tokenSaliences: string;
  categories: string[];
  ownership: CONTENT_ENTITY_OWNERSHIP;
  author: string;
  type: CONTENT_ENTITY_TYPE;
  language: string;
  createdDate: Date;
  lastModifiedDate: Date;
};

type TokenCount = {
  token: string;
  count: number;
};

class ContentEntity extends AbstractEntity<
  OptionalContentEntityInitParams,
  ContentEntityBuildParams,
  ContentEntityBuildResponse
> {
  private _nGramHandler!: NGramHandler;

  protected _buildTemplate = (
    buildParams: ContentEntityBuildParams
  ): ContentEntityBuildResponse => {
    const {
      postedById,
      title,
      coverImageUrl,
      sourceUrl,
      summary,
      tokens,
      tokenSaliences,
      categories,
      language,
      ownership,
      author,
      type,
    } = buildParams;
    const contentEntity = {
      postedById,
      title,
      titleNGrams: this._nGramHandler.createEdgeNGrams({ str: title, isPrefixOnly: false }),
      coverImageUrl,
      sourceUrl,
      summary,
      tokens,
      tokenSaliences,
      categories,
      language,
      ownership,
      author,
      type,
      createdDate: new Date(),
      lastModifiedDate: new Date(),
    };
    return contentEntity;
  };

  protected _initTemplate = async (
    optionalInitParams: OptionalContentEntityInitParams
  ): Promise<void> => {
    const { makeNGramHandler } = optionalInitParams;
    this._nGramHandler = makeNGramHandler;
  };
}

export {
  OptionalContentEntityInitParams,
  ContentEntityBuildParams,
  ContentEntityBuildResponse,
  ContentEntity,
  CONTENT_ENTITY_OWNERSHIP,
  CONTENT_ENTITY_TYPE,
  TokenCount,
};
