import { JoinedUserDoc } from '../../../../models/User';
import { StringKeyObject } from '../../../../types/custom';
import { DbServiceAccessOptions } from '../../../dataAccess/abstractions/IDbService';
import { TeacherDbServiceResponse } from '../../../dataAccess/services/teacher/teacherDbService';
import { AbstractGetUsecase } from '../../abstractions/AbstractGetUsecase';
import { MakeRequestTemplateParams } from '../../abstractions/AbstractUsecase';

type OptionalGetTeachersUsecaseInitParams = {};
type GetPendingTeachersUsecaseResponse = { teachers: JoinedUserDoc[]; pages: number };

class GetPendingTeachersUsecase extends AbstractGetUsecase<
  OptionalGetTeachersUsecaseInitParams,
  GetPendingTeachersUsecaseResponse,
  TeacherDbServiceResponse
> {
  protected _makeRequestTemplate = async (
    props: MakeRequestTemplateParams
  ): Promise<GetPendingTeachersUsecaseResponse> => {
    const { query, dbServiceAccessOptions } = props;
    const pendingTeachersRes = await this._getPendingTeachersRes({ query, dbServiceAccessOptions });
    return pendingTeachersRes;
  };

  private _getPendingTeachersRes = async (props: {
    dbServiceAccessOptions: DbServiceAccessOptions;
    query: StringKeyObject;
  }): Promise<GetPendingTeachersUsecaseResponse> => {
    const { dbServiceAccessOptions, query } = props;
    const searchQuery = {
      applicationStatus: 'pending',
    };
    const fallbackQuery = { page: 0, limit: 10 };
    const sort = { 'teacherData.createdDate': 1 };
    const paginationOptions = this._getPaginationOptions({ query, fallbackQuery, sort });
    const parentDbServiceAccessOptions = { ...dbServiceAccessOptions, isReturningParent: true };
    const teachers = <JoinedUserDoc[]>await this._dbService.find({
      searchQuery,
      dbServiceAccessOptions: parentDbServiceAccessOptions,
      paginationOptions,
    });
    const count = await this._dbService.countDocuments({
      searchQuery,
      dbServiceAccessOptions: parentDbServiceAccessOptions,
    });
    const pages = Math.ceil(count / paginationOptions.limit) - 1;
    return { teachers, pages };
  };
}

export { GetPendingTeachersUsecase, GetPendingTeachersUsecaseResponse };
