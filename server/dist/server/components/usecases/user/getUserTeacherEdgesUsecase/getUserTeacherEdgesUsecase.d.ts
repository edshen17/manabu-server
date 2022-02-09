import { JoinedUserDoc } from '../../../../models/User';
import { GraphDbService } from '../../../dataAccess/services/graph/graphDbService';
import { UserDbServiceResponse } from '../../../dataAccess/services/user/userDbService';
import { AbstractGetUsecase } from '../../abstractions/AbstractGetUsecase';
import { MakeRequestTemplateParams } from '../../abstractions/AbstractUsecase';
declare type OptionalGetUserTeacherEdgesUsecaseInitParams = {
    makeGraphDbService: Promise<GraphDbService>;
};
declare type GetUserTeacherEdgesUsecaseResponse = {
    users: JoinedUserDoc[];
    pages: number;
};
declare class GetUserTeacherEdgesUsecase extends AbstractGetUsecase<OptionalGetUserTeacherEdgesUsecaseInitParams, GetUserTeacherEdgesUsecaseResponse, UserDbServiceResponse> {
    private _graphDbService;
    protected _isProtectedResource: () => boolean;
    protected _makeRequestTemplate: (props: MakeRequestTemplateParams) => Promise<GetUserTeacherEdgesUsecaseResponse>;
    private _getGraphQuery;
    private _getProcessedQuery;
    protected _initTemplate: (optionalInitParams: OptionalGetUserTeacherEdgesUsecaseInitParams) => Promise<void>;
}
export { GetUserTeacherEdgesUsecase, GetUserTeacherEdgesUsecaseResponse };
