import { AccessOptions } from '../../dataAccess/abstractions/IDbOperations';
import { TeacherDbService } from '../../dataAccess/services/teacher/teacherDbService';
import { JoinedUserDoc, UserDbService } from '../../dataAccess/services/user/userDbService';
import { AbstractEditUsecase } from '../abstractions/AbstractEditUsecase';
import { MakeRequestTemplateParams } from '../abstractions/AbstractUsecase';
import { ControllerData, IUsecase } from '../abstractions/IUsecase';

type EditTeacherUsecaseResponse = { user: JoinedUserDoc } | Error;

class EditTeacherUsecase
  extends AbstractEditUsecase<EditTeacherUsecaseResponse>
  implements IUsecase<EditTeacherUsecaseResponse>
{
  private userDbService!: UserDbService;
  private teacherDbService!: TeacherDbService;

  protected _isValidRequest = (controllerData: ControllerData) => {
    const { body } = controllerData.routeData.body;
    const { userId, _id } = body || {};
    return !userId && !_id;
  };

  protected _makeRequestTemplate = async (
    props: MakeRequestTemplateParams
  ): Promise<EditTeacherUsecaseResponse> => {
    const { params, body, accessOptions } = props;
    const updatedDbTeacher = await this.teacherDbService.findOneAndUpdate({
      searchQuery: { userId: params.uId },
      updateParams: body,
      accessOptions,
    });

    if (updatedDbTeacher) {
      const _id = updatedDbTeacher.userId;
      const savedDbUser = await this.userDbService.findById({
        _id,
        accessOptions,
      });
      return { user: savedDbUser };
    } else {
      throw new Error('Access denied.');
    }
  };

  public init = async (services: {
    makeUserDbService: Promise<UserDbService>;
    makeTeacherDbService: Promise<TeacherDbService>;
  }): Promise<this> => {
    const { makeUserDbService, makeTeacherDbService } = services;
    this.userDbService = await makeUserDbService;
    this.teacherDbService = await makeTeacherDbService;
    return this;
  };
}

export { EditTeacherUsecase, EditTeacherUsecaseResponse };
