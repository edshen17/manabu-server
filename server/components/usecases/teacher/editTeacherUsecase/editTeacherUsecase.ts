import { JoinedUserDoc } from '../../../../models/User';
import { TeacherDbServiceResponse } from '../../../dataAccess/services/teacher/teacherDbService';
import {
  AbstractEditUsecase,
  AbstractEditUsecaseInitParams,
  AbstractEditUsecaseInitTemplateParams,
} from '../../abstractions/AbstractEditUsecase';
import { MakeRequestTemplateParams } from '../../abstractions/AbstractUsecase';

type OptionalEditTeacherUsecaseInitParams = {
  currency: any;
};

type EditTeacherUsecaseResponse = { user: JoinedUserDoc };

class EditTeacherUsecase extends AbstractEditUsecase<
  AbstractEditUsecaseInitParams<OptionalEditTeacherUsecaseInitParams>,
  EditTeacherUsecaseResponse,
  TeacherDbServiceResponse
> {
  private _currency!: any;

  protected _makeRequestTemplate = async (
    props: MakeRequestTemplateParams
  ): Promise<EditTeacherUsecaseResponse> => {
    const { params, body, dbServiceAccessOptions } = props;
    const { priceData } = body || {};
    const { hourlyRate } = priceData || {};
    dbServiceAccessOptions.isReturningParent = true;
    if (hourlyRate) {
      priceData.hourlyRate = this._currency(priceData.hourlyRate).value;
    }
    const user = <JoinedUserDoc>await this._dbService.findOneAndUpdate({
      searchQuery: { _id: params.teacherId },
      updateQuery: body,
      dbServiceAccessOptions,
    });
    const usecaseRes = { user };
    return usecaseRes;
  };

  protected _initTemplate = async (
    optionalInitParams: AbstractEditUsecaseInitTemplateParams<OptionalEditTeacherUsecaseInitParams>
  ): Promise<void> => {
    const { currency, makeEditEntityValidator } = optionalInitParams;
    this._currency = currency;
    this._editEntityValidator = makeEditEntityValidator;
  };
}

export { EditTeacherUsecase, EditTeacherUsecaseResponse };
