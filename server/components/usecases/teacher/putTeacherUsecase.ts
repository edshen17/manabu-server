import { AccessOptions } from '../../dataAccess/abstractions/IDbOperations';
import { TeacherDbService } from '../../dataAccess/services/teachersDb';
import { JoinedUserDoc, UserDbService } from '../../dataAccess/services/usersDb';
import { AbstractPutUsecase } from '../abstractions/AbstractPutUsecase';
import { MakeRequestTemplateParams } from '../abstractions/AbstractUsecase';
import { ControllerData, IUsecase } from '../abstractions/IUsecase';

type PutTeacherUsecaseResponse = { user: JoinedUserDoc } | Error;

class PutTeacherUsecase
  extends AbstractPutUsecase<PutTeacherUsecaseResponse>
  implements IUsecase<PutTeacherUsecaseResponse>
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
  ): Promise<PutTeacherUsecaseResponse> => {
    const { params, body, accessOptions } = props;
    const updatedDbTeacher = await this.teacherDbService.update({
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

export { PutTeacherUsecase, PutTeacherUsecaseResponse };
