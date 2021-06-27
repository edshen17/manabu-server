import { DefaultSelectOptions } from './AbstractDbOperations';

type AccessOptions = {
  isProtectedResource: boolean;
  isCurrentAPIUserPermitted: boolean;
  currentAPIUserRole: string | undefined;
  isSelf: boolean;
  isOverridingSelectOptions?: boolean;
};

type DbParams = {
  _id?: string;
  searchQuery?: {};
  accessOptions: AccessOptions;
  modelToInsert?: {};
  updateParams?: {};
};

interface IDbOperations<DbDoc> {
  findById: (params: DbParams) => Promise<DbDoc>;
  findOne: (params: DbParams) => Promise<DbDoc>;
  find: (params: DbParams) => Promise<DbDoc[]>;
  insert: (params: DbParams) => Promise<DbDoc>;
  insertMany: (params: DbParams) => Promise<DbDoc[]>;
  findOneAndUpdate: (params: DbParams) => Promise<DbDoc>;
  updateMany: (params: DbParams) => Promise<DbDoc[]>;
  findByIdAndDelete: (params: DbParams) => Promise<DbDoc>;
  init: (props: any) => Promise<this>;
  getDefaultSelectOptions: () => DefaultSelectOptions;
}

export { AccessOptions, DbParams, IDbOperations };
