import { JoinedUserDoc } from '../../../../models/User';
import { DbServiceAccessOptions } from '../../../dataAccess/abstractions/IDbService';
import { TeacherDbService } from '../../../dataAccess/services/teacher/teacherDbService';
import { ENTITY_VALIDATOR_VALIDATE_MODES } from '../../../validators/abstractions/AbstractEntityValidator';
import {
  AbstractEditUsecase,
  AbstractEditUsecaseInitParams,
} from '../../abstractions/AbstractEditUsecase';
import { MakeRequestTemplateParams } from '../../abstractions/AbstractUsecase';

type OptionalEditTeacherUsecaseInitParams = {
  makeTeacherDbService: Promise<TeacherDbService>;
};

type EditTeacherUsecaseResponse = { user: JoinedUserDoc };

class EditTeacherUsecase extends AbstractEditUsecase<
  AbstractEditUsecaseInitParams<OptionalEditTeacherUsecaseInitParams>,
  EditTeacherUsecaseResponse
> {
  private _teacherDbService!: TeacherDbService;

  protected _makeRequestTemplate = async (
    props: MakeRequestTemplateParams
  ): Promise<EditTeacherUsecaseResponse> => {
    const { params, body, dbServiceAccessOptions } = props;
    const dbServiceAccessOptionsCopy: DbServiceAccessOptions =
      this._cloneDeep(dbServiceAccessOptions);
    dbServiceAccessOptionsCopy.isReturningParent = true;
    const savedDbTeacher = <JoinedUserDoc>await this._teacherDbService.findOneAndUpdate({
      searchQuery: { _id: params.teacherId },
      updateQuery: body,
      dbServiceAccessOptions: dbServiceAccessOptionsCopy,
      dbDependencyUpdateParams: {
        updatedDependentSearchQuery: {
          _id: params.teacherId,
        },
      },
    });
    const usecaseRes = { user: savedDbTeacher };
    return usecaseRes;
  };

  protected _initTemplate = async (
    optionalInitParams: AbstractEditUsecaseInitParams<OptionalEditTeacherUsecaseInitParams>
  ) => {
    const { makeTeacherDbService, makeEditEntityValidator } = optionalInitParams;
    this._teacherDbService = await makeTeacherDbService;
    this._editEntityValidator = makeEditEntityValidator;
  };
}

export { EditTeacherUsecase, EditTeacherUsecaseResponse };
