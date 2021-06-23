import { DefaultSelectOptions } from './CommonDbOperations';

type AccessOptions = {
  isProtectedResource: boolean;
  isCurrentAPIUserPermitted: boolean;
  currentAPIUserRole: string | undefined;
  isSelf: boolean;
  isOverridingSelectOptions?: boolean;
};

type DbParams = {
  _id?: any;
  searchQuery?: {};
  accessOptions: AccessOptions;
  modelToInsert?: {};
  updateParams?: {};
};

interface IDbOperations<DbDoc, DefaultDbInitParams> {
  findById: (params: DbParams) => Promise<DbDoc>;
  findOne: (params: DbParams) => Promise<DbDoc>;
  find: (params: DbParams) => Promise<DbDoc[]>;
  insert: (params: DbParams) => Promise<DbDoc>;
  insertMany: (params: DbParams) => Promise<DbDoc[]>;
  findOneAndUpdate: (params: DbParams) => Promise<DbDoc>;
  updateMany: (params: DbParams) => Promise<DbDoc[]>;
  findByIdAndDelete: (params: DbParams) => Promise<DbDoc>;
  init: (props: DefaultDbInitParams) => Promise<this>;
  getDefaultSelectOptions: () => DefaultSelectOptions;
}

export { AccessOptions, DbParams, IDbOperations };
