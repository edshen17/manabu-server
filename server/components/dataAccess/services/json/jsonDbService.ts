import { REDIS_JSON_URL } from '../../../../constants';
import { StringKeyObject } from '../../../../types/custom';

class JsonDbService {
  private _client!: any;
  private _entity!: any;
  private _schema!: any;
  private _repository!: any;

  public init = async (initParams: {
    client: any;
    entity: any;
    schema: any;
    repository: any;
  }): Promise<this> => {
    const { client, entity, schema, repository } = initParams;
    this._client = client;
    this._entity = entity;
    this._schema = schema;
    this._repository = repository;
    await this._client.open(REDIS_JSON_URL);
    return this;
  };

  private _createWordSchema = (): StringKeyObject => {
    class Word extends this._entity {}
    const schema = new this._schema(Word, {
      word: { type: 'string' },
      definition: { type: 'string' },
      audioLinks: { type: 'array' },
      wordLanguage: { type: 'string' },
      definitionLanguage: { type: 'string' },
      // meta: Object
      // createdDate: Date,
      // lastModifiedDate: Date
    });
  };
}

export { JsonDbService };
