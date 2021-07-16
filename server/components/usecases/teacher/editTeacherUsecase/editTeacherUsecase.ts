import { JoinedUserDoc } from '../../../../models/User';
import { TeacherDbService } from '../../../dataAccess/services/teacher/teacherDbService';
import { UserDbService } from '../../../dataAccess/services/user/userDbService';
import { AbstractEditUsecase } from '../../abstractions/AbstractEditUsecase';
import { MakeRequestTemplateParams } from '../../abstractions/AbstractUsecase';
import { ControllerData } from '../../abstractions/IUsecase';

type OptionalEditTeacherUsecaseInitParams = {
  makeUserDbService: Promise<UserDbService>;
  makeTeacherDbService: Promise<TeacherDbService>;
};
type EditTeacherUsecaseResponse = { user: JoinedUserDoc };

class EditTeacherUsecase extends AbstractEditUsecase<
  OptionalEditTeacherUsecaseInitParams,
  EditTeacherUsecaseResponse
> {
  private _userDbService!: UserDbService;
  private _teacherDbService!: TeacherDbService;

  protected _isValidRequest = (controllerData: ControllerData) => {
    const { body } = controllerData.routeData.body;
    const { userId, _id, lessonCount, studentCount } = body || {};
    return !userId && !_id && !lessonCount && !studentCount;
  };

  protected _makeRequestTemplate = async (
    props: MakeRequestTemplateParams
  ): Promise<EditTeacherUsecaseResponse> => {
    const { params, body, dbServiceAccessOptions } = props;
    const updatedDbTeacher = await this._teacherDbService.findOneAndUpdate({
      searchQuery: { userId: params.uId },
      updateParams: body,
      dbServiceAccessOptions,
    });
    const _id = updatedDbTeacher.userId;
    const savedDbUser = await this._userDbService.findById({
      _id,
      dbServiceAccessOptions,
    });
    const usecaseRes = { user: savedDbUser };
    return usecaseRes;
  };

  protected _initTemplate = async (optionalInitParams: OptionalEditTeacherUsecaseInitParams) => {
    const { makeUserDbService, makeTeacherDbService } = optionalInitParams;
    this._userDbService = await makeUserDbService;
    this._teacherDbService = await makeTeacherDbService;
  };
}

export { EditTeacherUsecase, EditTeacherUsecaseResponse };
