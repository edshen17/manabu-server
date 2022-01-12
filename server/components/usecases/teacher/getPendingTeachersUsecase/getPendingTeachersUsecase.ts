import { JoinedUserDoc } from '../../../../models/User';
import { StringKeyObject } from '../../../../types/custom';
import { DbServiceAccessOptions } from '../../../dataAccess/abstractions/IDbService';
import { TeacherDbServiceResponse } from '../../../dataAccess/services/teacher/teacherDbService';
import { AbstractGetUsecase } from '../../abstractions/AbstractGetUsecase';
import { MakeRequestTemplateParams } from '../../abstractions/AbstractUsecase';

type OptionalGetTeachersUsecaseInitParams = {};
type GetPendingTeachersUsecaseResponse = { teachers: JoinedUserDoc[] };

class GetPendingTeachersUsecase extends AbstractGetUsecase<
  OptionalGetTeachersUsecaseInitParams,
  GetPendingTeachersUsecaseResponse,
  TeacherDbServiceResponse
> {
  protected _makeRequestTemplate = async (
    props: MakeRequestTemplateParams
  ): Promise<GetPendingTeachersUsecaseResponse> => {
    const { query, dbServiceAccessOptions } = props;
    const teachers = await this._getPendingTeachers({ query, dbServiceAccessOptions });
    return { teachers };
  };

  private _getPendingTeachers = async (props: {
    dbServiceAccessOptions: DbServiceAccessOptions;
    query: StringKeyObject;
  }): Promise<JoinedUserDoc[]> => {
    const { dbServiceAccessOptions, query } = props;
    const fallbackQuery = { page: 0, limit: 10 };
    const sort = { 'teacherData.createdDate': 1 };
    const paginationOptions = this._getPaginationOptions({ query, fallbackQuery, sort });
    const pendingTeachers = <JoinedUserDoc[]>await this._dbService.find({
      searchQuery: {
        applicationStatus: 'pending',
      },
      dbServiceAccessOptions,
      paginationOptions,
    });
    return pendingTeachers;
  };
}

export { GetPendingTeachersUsecase, GetPendingTeachersUsecaseResponse };
