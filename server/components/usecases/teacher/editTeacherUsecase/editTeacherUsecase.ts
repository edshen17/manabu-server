import { TeacherDbService } from '../../../dataAccess/services/teacher/teacherDbService';
import { JoinedUserDoc, UserDbService } from '../../../dataAccess/services/user/userDbService';
import { AbstractEditUsecase } from '../../abstractions/AbstractEditUsecase';
import { MakeRequestTemplateParams } from '../../abstractions/AbstractUsecase';
import { ControllerData, IUsecase } from '../../abstractions/IUsecase';

type EditTeacherUsecaseUsecaseInitParams = {
  makeUserDbService: Promise<UserDbService>;
  makeTeacherDbService: Promise<TeacherDbService>;
};
type EditTeacherUsecaseResponse = { user: JoinedUserDoc } | Error;

class EditTeacherUsecase extends AbstractEditUsecase<
  EditTeacherUsecaseUsecaseInitParams,
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

    if (updatedDbTeacher) {
      const _id = updatedDbTeacher.userId;
      const savedDbUser = await this._userDbService.findById({
        _id,
        dbServiceAccessOptions,
      });
      const usecaseRes = { user: savedDbUser };
      return usecaseRes;
    } else {
      throw new Error('Access denied.');
    }
  };

  public init = async (usecaseInitParams: EditTeacherUsecaseUsecaseInitParams): Promise<this> => {
    const { makeUserDbService, makeTeacherDbService } = usecaseInitParams;
    this._userDbService = await makeUserDbService;
    this._teacherDbService = await makeTeacherDbService;
    return this;
  };
}

export { EditTeacherUsecase, EditTeacherUsecaseResponse };
