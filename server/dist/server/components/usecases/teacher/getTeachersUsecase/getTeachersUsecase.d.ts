import { JoinedUserDoc } from '../../../../models/User';
import { TeacherDbServiceResponse } from '../../../dataAccess/services/teacher/teacherDbService';
import { AbstractGetUsecase } from '../../abstractions/AbstractGetUsecase';
import { MakeRequestTemplateParams } from '../../abstractions/AbstractUsecase';
declare type OptionalGetTeachersUsecaseInitParams = {};
declare type GetTeachersUsecaseResponse = {
    teachers: JoinedUserDoc[];
};
declare class GetTeachersUsecase extends AbstractGetUsecase<OptionalGetTeachersUsecaseInitParams, GetTeachersUsecaseResponse, TeacherDbServiceResponse> {
    protected _makeRequestTemplate: (props: MakeRequestTemplateParams) => Promise<GetTeachersUsecaseResponse>;
    private _getTeachers;
    private _processQuery;
    private _handleUserFilters;
    private _handleTeacherFilters;
    private _handlePackageFilters;
}
export { GetTeachersUsecase, GetTeachersUsecaseResponse };
