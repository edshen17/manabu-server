import { DbDependencyUpdateParams, DbServiceAccessOptions } from '../../abstractions/IDbService';
import { AbstractDbService } from '../../abstractions/AbstractDbService';
import { TeacherDoc } from '../../../../models/Teacher';
import { UserDbService } from '../user/userDbService';

type OptionalTeacherDbServiceInitParams = {
  makeUserDbService: Promise<UserDbService>;
};

class TeacherDbService extends AbstractDbService<OptionalTeacherDbServiceInitParams, TeacherDoc> {
  private _userDbService!: UserDbService;
  constructor() {
    super();
    this._dbModelViews = {
      defaultView: {},
      adminView: {},
      selfView: {},
      overrideView: {},
    };
  }

  public findOne = async (dbServiceParams: {
    searchQuery?: {};
    dbServiceAccessOptions: DbServiceAccessOptions;
  }): Promise<TeacherDoc> => {
    const { searchQuery, dbServiceAccessOptions } = dbServiceParams;
    const embeddedSearchQuery = this._convertToEmbeddedQuery(searchQuery);
    const dbQueryPromise = this._userDbService.findOne({
      searchQuery: embeddedSearchQuery,
      dbServiceAccessOptions,
    });
    const dbQueryResult = await this._dbQueryReturnTemplate(dbServiceAccessOptions, dbQueryPromise);
    return dbQueryResult;
  };

  protected _convertToEmbeddedQuery = (query?: StringKeyObject): {} => {
    const embeddedSearchQuery: StringKeyObject = {};
    for (const property in query) {
      const embeddedProperty = `teacherData.${property}`;
      embeddedSearchQuery[embeddedProperty] = query[property];
    }
    return embeddedSearchQuery;
  };

  protected _dbQueryReturnTemplate = async (
    dbServiceAccessOptions: DbServiceAccessOptions,
    dbQueryPromise: any
  ): Promise<any> => {
    const dbQueryResult = await dbQueryPromise;
    if (!dbQueryResult) {
      return null;
    }
    if (Array.isArray(dbQueryResult)) {
      const savedDbTeachers = dbQueryResult.map((user) => {
        return user.teacherData;
      });
      return savedDbTeachers;
    } else {
      const savedDbTeacher = dbQueryResult.teacherData;
      return savedDbTeacher;
    }
  };

  public findById = async (dbServiceParams: {
    _id?: any;
    dbServiceAccessOptions: DbServiceAccessOptions;
  }): Promise<TeacherDoc> => {
    const { _id, dbServiceAccessOptions } = dbServiceParams;
    const embeddedSearchQuery = this._convertToEmbeddedQuery({ _id });
    const dbQueryPromise = this._userDbService.findOne({
      searchQuery: embeddedSearchQuery,
      dbServiceAccessOptions,
    });
    const dbQueryResult = await this._dbQueryReturnTemplate(dbServiceAccessOptions, dbQueryPromise);
    return dbQueryResult;
  };

  public find = async (dbServiceParams: {
    searchQuery?: {};
    dbServiceAccessOptions: DbServiceAccessOptions;
  }): Promise<TeacherDoc[]> => {
    const { searchQuery, dbServiceAccessOptions } = dbServiceParams;
    const embeddedSearchQuery = this._convertToEmbeddedQuery(searchQuery);
    const dbQueryPromise = this._userDbService.find({
      searchQuery: embeddedSearchQuery,
      dbServiceAccessOptions,
    });
    const dbQueryResult = await this._dbQueryReturnTemplate(dbServiceAccessOptions, dbQueryPromise);
    return dbQueryResult;
  };

  public insert = async (dbServiceParams: {
    modelToInsert?: {};
    dbServiceAccessOptions: DbServiceAccessOptions;
  }): Promise<TeacherDoc> => {
    throw new Error('Cannot insert an embedded document.');
  };

  public insertMany = async (dbServiceParams: {
    modelToInsert?: {};
    dbServiceAccessOptions: DbServiceAccessOptions;
  }): Promise<TeacherDoc[]> => {
    throw new Error('Cannot insert many embedded documents.');
  };

  public findOneAndUpdate = async (dbServiceParams: {
    searchQuery?: {};
    updateParams?: {};
    dbServiceAccessOptions: DbServiceAccessOptions;
    dbDependencyUpdateParams?: DbDependencyUpdateParams;
  }): Promise<TeacherDoc> => {
    const { searchQuery, updateParams, dbServiceAccessOptions, dbDependencyUpdateParams } =
      dbServiceParams;
    const embeddedSearchQuery = this._convertToEmbeddedQuery(searchQuery);
    const embeddedUpdateQuery = this._convertToEmbeddedQuery(updateParams);
    const embeddedDbDependencyUpdateQuery = this._convertToEmbeddedQuery(dbDependencyUpdateParams);
    const dbQueryPromise = this._userDbService.findOneAndUpdate({
      searchQuery: embeddedSearchQuery,
      updateParams: embeddedUpdateQuery,
      dbServiceAccessOptions,
    });
    const dbQueryResult = await this._dbQueryReturnTemplate(dbServiceAccessOptions, dbQueryPromise);
    await this._updateDbDependencyHandler({
      dbDependencyUpdateParams: embeddedDbDependencyUpdateQuery,
    });
    return dbQueryResult;
  };

  public updateMany = async (dbServiceParams: {
    searchQuery?: {};
    updateParams?: {};
    dbServiceAccessOptions: DbServiceAccessOptions;
    dbDependencyUpdateParams?: DbDependencyUpdateParams;
  }): Promise<TeacherDoc[]> => {
    const { searchQuery, updateParams, dbServiceAccessOptions, dbDependencyUpdateParams } =
      dbServiceParams;
    const embeddedSearchQuery = this._convertToEmbeddedQuery(searchQuery);
    const embeddedUpdateQuery = this._convertToEmbeddedQuery(updateParams);
    const embeddedDbDependencyUpdateQuery = this._convertToEmbeddedQuery(dbDependencyUpdateParams);
    const dbQueryPromise = this._userDbService.updateMany({
      searchQuery: embeddedSearchQuery,
      updateParams: embeddedUpdateQuery,
      dbServiceAccessOptions,
      dbDependencyUpdateParams: embeddedDbDependencyUpdateQuery,
    });
    const dbQueryResult = await this._dbQueryReturnTemplate(dbServiceAccessOptions, dbQueryPromise);
    await this._updateDbDependencyHandler({ dbDependencyUpdateParams });
    return dbQueryResult;
  };

  public findByIdAndDelete = async (dbServiceParams: {
    _id?: any;
    dbServiceAccessOptions: DbServiceAccessOptions;
  }): Promise<TeacherDoc> => {
    const { _id, dbServiceAccessOptions } = dbServiceParams;
    const dbQueryResult = await this.findOneAndDelete({
      searchQuery: { _id },
      dbServiceAccessOptions,
    });
    return dbQueryResult;
  };

  public findOneAndDelete = async (dbServiceParams: {
    searchQuery?: {};
    dbServiceAccessOptions: DbServiceAccessOptions;
  }): Promise<TeacherDoc> => {
    const { searchQuery, dbServiceAccessOptions } = dbServiceParams;
    const embeddedSearchQuery = this._convertToEmbeddedQuery(searchQuery);
    const dbQueryPromise = this._userDbService.findOneAndUpdate({
      searchQuery: embeddedSearchQuery,
      updateParams: { $unset: { teacherData: true } },
      dbServiceAccessOptions,
    });
    const dbQueryResult = await this._dbQueryReturnTemplate(dbServiceAccessOptions, dbQueryPromise);
    return dbQueryResult;
  };

  protected _initTemplate = async (
    optionalDbServiceInitParams: OptionalTeacherDbServiceInitParams
  ) => {
    const { makeUserDbService } = optionalDbServiceInitParams;
    this._userDbService = await makeUserDbService;
  };
}

export { TeacherDbService };
