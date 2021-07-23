import { JoinedUserDoc } from '../../../../models/User';
import { TeacherDbService } from '../../../dataAccess/services/teacher/teacherDbService';
import { UserDbService } from '../../../dataAccess/services/user/userDbService';
import {
  AbstractEditUsecase,
  AbstractEditUsecaseInitParams,
} from '../../abstractions/AbstractEditUsecase';
import { MakeRequestTemplateParams } from '../../abstractions/AbstractUsecase';

type OptionalEditTeacherUsecaseInitParams = {
  makeUserDbService: Promise<UserDbService>;
  makeTeacherDbService: Promise<TeacherDbService>;
};

type EditTeacherUsecaseResponse = { user: JoinedUserDoc };

class EditTeacherUsecase extends AbstractEditUsecase<
  AbstractEditUsecaseInitParams<OptionalEditTeacherUsecaseInitParams>,
  EditTeacherUsecaseResponse
> {
  private _userDbService!: UserDbService;
  private _teacherDbService!: TeacherDbService;

  protected _makeRequestTemplate = async (
    props: MakeRequestTemplateParams
  ): Promise<EditTeacherUsecaseResponse> => {
    const { params, body, dbServiceAccessOptions } = props;
    const updatedDbTeacher = await this._teacherDbService.findOneAndUpdate({
      searchQuery: { _id: params.uId },
      updateQuery: body,
      dbServiceAccessOptions,
    });
    const savedDbUser = await this._userDbService.findById({
      _id: params.uId,
      dbServiceAccessOptions,
    });
    const usecaseRes = { user: savedDbUser };
    return usecaseRes;
  };

  protected _initTemplate = async (
    optionalInitParams: AbstractEditUsecaseInitParams<OptionalEditTeacherUsecaseInitParams>
  ) => {
    const { makeUserDbService, makeTeacherDbService, makeEditEntityValidator } = optionalInitParams;
    this._userDbService = await makeUserDbService;
    this._teacherDbService = await makeTeacherDbService;
    this._editEntityValidator = makeEditEntityValidator;
  };
}

export { EditTeacherUsecase, EditTeacherUsecaseResponse };
