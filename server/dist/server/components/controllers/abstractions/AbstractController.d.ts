import { ConvertStringToObjectId } from '../../entities/utils/convertStringToObjectId';
import { IUsecase } from '../../usecases/abstractions/IUsecase';
import { QueryStringHandler } from '../../usecases/utils/queryStringHandler/queryStringHandler';
import { IHttpRequest } from '../../webFrameworkCallbacks/abstractions/IHttpRequest';
import { ControllerResponse, IController } from './IController';
declare type ControllerParams = {
    successStatusCode: number;
    errorStatusCode: number;
};
declare abstract class AbstractController<UsecaseResponse> implements IController<UsecaseResponse> {
    protected _usecase: IUsecase<any, UsecaseResponse, any>;
    protected _queryStringHandler: QueryStringHandler;
    protected _successStatusCode: number;
    protected _errorStatusCode: number;
    protected _convertStringToObjectId: ConvertStringToObjectId;
    constructor(props: ControllerParams);
    makeRequest: (httpRequest: IHttpRequest) => Promise<ControllerResponse<UsecaseResponse>>;
    private _getUsecaseRes;
    private _convertParamsToObjectId;
    init: (props: {
        makeUsecase: Promise<IUsecase<any, UsecaseResponse, any>>;
        makeQueryStringHandler: QueryStringHandler;
        convertStringToObjectId: any;
    }) => Promise<this>;
}
export { AbstractController, ControllerParams };
