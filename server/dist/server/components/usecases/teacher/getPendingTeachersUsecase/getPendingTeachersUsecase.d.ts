import { JoinedUserDoc } from '../../../../models/User';
import { TeacherDbServiceResponse } from '../../../dataAccess/services/teacher/teacherDbService';
import { AbstractGetUsecase } from '../../abstractions/AbstractGetUsecase';
import { MakeRequestTemplateParams } from '../../abstractions/AbstractUsecase';
declare type OptionalGetTeachersUsecaseInitParams = {};
declare type GetPendingTeachersUsecaseResponse = {
    teachers: JoinedUserDoc[];
    pages: number;
};
declare class GetPendingTeachersUsecase extends AbstractGetUsecase<OptionalGetTeachersUsecaseInitParams, GetPendingTeachersUsecaseResponse, TeacherDbServiceResponse> {
    protected _makeRequestTemplate: (props: MakeRequestTemplateParams) => Promise<GetPendingTeachersUsecaseResponse>;
    private _getPendingTeachersRes;
}
export { GetPendingTeachersUsecase, GetPendingTeachersUsecaseResponse };
