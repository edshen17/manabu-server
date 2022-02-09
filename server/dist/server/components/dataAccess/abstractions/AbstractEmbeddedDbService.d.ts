/// <reference types="custom" />
import { StringKeyObject } from '../../../types/custom';
import { AbstractDbService } from './AbstractDbService';
import { DbServiceAccessOptions, DbServiceFindByIdParams, DbServiceFindOneParams, DbServiceFindParams, DbServiceInsertManyParams, DbServiceInsertParams, DbServiceUpdateParams, DeepEqual, IDbService } from './IDbService';
declare type AbstractEmbeddedDbServiceInitParams<OptionalDbServiceInitParams> = {
    makeParentDbService: Promise<IDbService<any, any>>;
    deepEqual: DeepEqual;
} & OptionalDbServiceInitParams;
declare enum DB_SERVICE_EMBED_TYPE {
    SINGLE = "single",
    MULTI = "multi"
}
declare abstract class AbstractEmbeddedDbService<OptionalDbServiceInitParams, DbDoc> extends AbstractDbService<AbstractEmbeddedDbServiceInitParams<OptionalDbServiceInitParams>, DbDoc> {
    protected _parentDbService: IDbService<any, any>;
    protected _deepEqual: DeepEqual;
    protected _embeddedFieldData: {
        parentFieldName: string;
        childFieldName?: string;
        embedType: string;
    };
    findOne: (dbServiceParams: DbServiceFindOneParams) => Promise<DbDoc>;
    protected _convertToEmbeddedQuery: (query?: StringKeyObject | undefined) => {};
    private _hasReserved$;
    protected _getDbQueryResult: (props: {
        dbServiceAccessOptions: DbServiceAccessOptions;
        dbQueryPromise: any;
        searchQuery?: {};
    }) => Promise<any>;
    private _handleEmbeddedField;
    findById: (dbServiceParams: DbServiceFindByIdParams) => Promise<DbDoc>;
    find: (dbServiceParams: DbServiceFindParams) => Promise<DbDoc[]>;
    countDocuments: (dbServiceParams: DbServiceFindOneParams) => Promise<number>;
    insert: (dbServiceParams: DbServiceInsertParams) => Promise<DbDoc>;
    insertMany: (dbServiceParams: DbServiceInsertManyParams) => Promise<DbDoc[]>;
    findOneAndUpdate: (dbServiceParams: DbServiceUpdateParams) => Promise<DbDoc>;
    private _configureEmbeddedUpdateQuery;
    updateMany: (dbServiceParams: DbServiceUpdateParams) => Promise<DbDoc[]>;
    findByIdAndDelete: (dbServiceParams: DbServiceFindByIdParams) => Promise<DbDoc>;
    findOneAndDelete: (dbServiceParams: DbServiceFindOneParams) => Promise<DbDoc>;
    private _configureDeleteUpdateQuery;
}
export { AbstractEmbeddedDbService, DB_SERVICE_EMBED_TYPE, AbstractEmbeddedDbServiceInitParams };
