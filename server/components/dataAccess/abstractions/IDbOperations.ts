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
  findById: (dbParams: DbParams) => Promise<DbDoc>;
  findOne: (dbParams: DbParams) => Promise<DbDoc>;
  find: (dbParams: DbParams) => Promise<DbDoc[]>;
  insert: (dbParams: DbParams) => Promise<DbDoc>;
  insertMany: (dbParams: DbParams) => Promise<DbDoc[]>;
  findOneAndUpdate: (dbParams: DbParams) => Promise<DbDoc>;
  updateMany: (dbParams: DbParams) => Promise<DbDoc[]>;
  findByIdAndDelete: (dbParams: DbParams) => Promise<DbDoc>;
  init: (props: any) => Promise<this>;
  getDefaultSelectOptions: () => DefaultSelectOptions;
}

export { AccessOptions, DbParams, IDbOperations };
