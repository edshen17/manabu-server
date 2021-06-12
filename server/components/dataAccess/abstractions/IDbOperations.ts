import { Types } from 'mongoose';

type AccessOptions = {
  isProtectedResource: boolean;
  isCurrentAPIUserPermitted: boolean;
  currentAPIUserRole: string | undefined;
  isSelf: boolean;
};

type DbParams = {
  _id?: any;
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
  update: (params: DbParams) => Promise<DbDoc>;
  updateMany: (params: DbParams) => Promise<DbDoc>;
  init: (props: any) => Promise<this>;
}

export { AccessOptions, DbParams, IDbOperations };
