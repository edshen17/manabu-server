import { JoinedUserDoc } from '../../../../models/User';
import { TeacherDbServiceResponse } from '../../../dataAccess/services/teacher/teacherDbService';
import { AbstractEditUsecase, AbstractEditUsecaseInitParams, AbstractEditUsecaseInitTemplateParams } from '../../abstractions/AbstractEditUsecase';
import { MakeRequestTemplateParams } from '../../abstractions/AbstractUsecase';
declare type OptionalEditTeacherUsecaseInitParams = {
    currency: any;
};
declare type EditTeacherUsecaseResponse = {
    user: JoinedUserDoc;
};
declare class EditTeacherUsecase extends AbstractEditUsecase<AbstractEditUsecaseInitParams<OptionalEditTeacherUsecaseInitParams>, EditTeacherUsecaseResponse, TeacherDbServiceResponse> {
    private _currency;
    protected _makeRequestTemplate: (props: MakeRequestTemplateParams) => Promise<EditTeacherUsecaseResponse>;
    protected _initTemplate: (optionalInitParams: AbstractEditUsecaseInitTemplateParams<OptionalEditTeacherUsecaseInitParams>) => Promise<void>;
}
export { EditTeacherUsecase, EditTeacherUsecaseResponse };
