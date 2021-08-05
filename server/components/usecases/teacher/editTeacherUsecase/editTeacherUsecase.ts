import { JoinedUserDoc } from '../../../../models/User';
import { DbServiceAccessOptions } from '../../../dataAccess/abstractions/IDbService';
import { TeacherDbService } from '../../../dataAccess/services/teacher/teacherDbService';
import {
  AbstractEditUsecase,
  AbstractEditUsecaseInitParams,
} from '../../abstractions/AbstractEditUsecase';
import { MakeRequestTemplateParams } from '../../abstractions/AbstractUsecase';

type OptionalEditTeacherUsecaseInitParams = {};

type EditTeacherUsecaseResponse = { user: JoinedUserDoc };

class EditTeacherUsecase extends AbstractEditUsecase<
  AbstractEditUsecaseInitParams<OptionalEditTeacherUsecaseInitParams>,
  EditTeacherUsecaseResponse,
  TeacherDbService
> {
  protected _makeRequestTemplate = async (
    props: MakeRequestTemplateParams
  ): Promise<EditTeacherUsecaseResponse> => {
    const { params, body, dbServiceAccessOptions } = props;
    const dbServiceAccessOptionsCopy: DbServiceAccessOptions =
      this._cloneDeep(dbServiceAccessOptions);
    dbServiceAccessOptionsCopy.isReturningParent = true;
    const savedDbTeacher = <JoinedUserDoc>await this._dbService.findOneAndUpdate({
      searchQuery: { _id: params.teacherId },
      updateQuery: body,
      dbServiceAccessOptions: dbServiceAccessOptionsCopy,
    });
    const usecaseRes = { user: savedDbTeacher };
    return usecaseRes;
  };

  protected _initTemplate = async (
    optionalInitParams: AbstractEditUsecaseInitParams<OptionalEditTeacherUsecaseInitParams>
  ) => {
    const { makeEditEntityValidator } = optionalInitParams;
    this._editEntityValidator = makeEditEntityValidator;
  };
}

export { EditTeacherUsecase, EditTeacherUsecaseResponse };
