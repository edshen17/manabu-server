import { TeacherDoc } from '../../../../models/Teacher';
import { JoinedUserDoc } from '../../../../models/User';
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
  TeacherDoc | JoinedUserDoc
> {
  protected _makeRequestTemplate = async (
    props: MakeRequestTemplateParams
  ): Promise<EditTeacherUsecaseResponse> => {
    const { params, body, dbServiceAccessOptions } = props;
    dbServiceAccessOptions.isReturningParent = true;
    const user = <JoinedUserDoc>await this._dbService.findOneAndUpdate({
      searchQuery: { _id: params.teacherId },
      updateQuery: body,
      dbServiceAccessOptions,
    });
    const usecaseRes = { user };
    return usecaseRes;
  };
}

export { EditTeacherUsecase, EditTeacherUsecaseResponse };
