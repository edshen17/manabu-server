import { SearchOptions } from '@node-redis/search/dist/commands/SEARCH';
import { Mongoose, Types } from 'mongoose';
import { SchemaFieldTypes } from 'redis';
import { RedisClient } from '.';
import { StringKeyObject } from '../../../../types/custom';

class JsonDbService {
  private _redisClient!: RedisClient;
  private _mongoose!: Mongoose;

  public insert = async (props: {
    modelName: string;
    modelToInsert: StringKeyObject;
  }): Promise<StringKeyObject> => {
    const { modelName, modelToInsert } = props;
    const pluralizedName = this._pluraizeName(modelName);
    const _id = new this._mongoose.Types.ObjectId() as any;
    await this._redisClient.json.set(`${pluralizedName}:${_id}`, '$', { _id, ...modelToInsert });
    const insertedModel = await this.findById({ modelName, _id });
    return insertedModel;
  };

  private _pluraizeName = (name: string): string => {
    const pluralizedName = `${name}s`;
    return pluralizedName;
  };

  public findById = async (props: { modelName: string; _id: any }): Promise<any> => {
    const { modelName, _id } = props;
    const pluralizedName = this._pluraizeName(modelName);
    const storedData = await this._redisClient.json.get(`${pluralizedName}:${_id}`);
    return storedData;
  };

  public findByIdAndDelete = async (props: {
    modelName: string;
    _id: Types.ObjectId;
  }): Promise<void> => {
    const { modelName, _id } = props;
    const pluralizedName = this._pluraizeName(modelName);
    await this._redisClient.json.del(`${pluralizedName}:${_id}`);
  };

  public search = async (props: {
    modelName: string;
    searchQuery: string;
    options?: SearchOptions;
  }): Promise<StringKeyObject> => {
    const { modelName, searchQuery, options } = props;
    const pluralizedName = this._pluraizeName(modelName);
    const resultData = await this._redisClient.ft.search(
      `idx:${pluralizedName}`,
      searchQuery,
      options
    );
    return resultData;
  };

  public init = async (initParams: { redisClient: any; mongoose: Mongoose }): Promise<this> => {
    const { redisClient, mongoose } = initParams;
    this._redisClient = redisClient;
    this._mongoose = mongoose;
    await this._redisClient.connect();
    await this._createJaToJaWordSchema();
    return this;
  };

  private _createJaToJaWordSchema = async (): Promise<void> => {
    await this.createSchema({
      modelName: 'ja-ja:word',
      model: {
        word: {
          type: SchemaFieldTypes.TEXT,
          SORTABLE: 'UNF',
          AS: 'word',
        },
        kana: {
          type: SchemaFieldTypes.TEXT,
          AS: 'kana',
        },
        definition: {
          type: SchemaFieldTypes.TEXT,
          AS: 'definition',
        },
        'audioLinks[0:]': {
          type: SchemaFieldTypes.TEXT,
          AS: 'audioLinks',
        },
        'pitch[0:]': {
          type: SchemaFieldTypes.NUMERIC,
          AS: 'pitch',
        },
      },
    });
  };

  public createSchema = async (props: {
    modelName: string;
    model: StringKeyObject;
  }): Promise<void> => {
    const { modelName, model } = props;
    const pluralizedName = this._pluraizeName(modelName);
    const redisModel: StringKeyObject = {};
    for (const property in model) {
      redisModel[`$.${property}`] = model[property];
    }
    try {
      await this._redisClient.ft.create(`idx:${pluralizedName}`, redisModel, {
        ON: 'JSON',
        PREFIX: `${pluralizedName}`,
      });
    } catch (err: any) {
      if (err.message != 'Index already exists') {
        throw err;
      }
    }
  };
}

export { JsonDbService };
