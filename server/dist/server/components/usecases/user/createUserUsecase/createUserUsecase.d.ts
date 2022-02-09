import { JoinedUserDoc } from '../../../../models/User';
import { DbServiceAccessOptions } from '../../../dataAccess/abstractions/IDbService';
import { GraphDbService } from '../../../dataAccess/services/graph/graphDbService';
import { PackageDbService } from '../../../dataAccess/services/package/packageDbService';
import { PackageTransactionDbService } from '../../../dataAccess/services/packageTransaction/packageTransactionDbService';
import { TeacherDbService } from '../../../dataAccess/services/teacher/teacherDbService';
import { UserDbServiceResponse } from '../../../dataAccess/services/user/userDbService';
import { PackageEntity } from '../../../entities/package/packageEntity';
import { PackageTransactionEntity } from '../../../entities/packageTransaction/packageTransactionEntity';
import { TeacherEntity } from '../../../entities/teacher/teacherEntity';
import { UserEntity } from '../../../entities/user/userEntity';
import { ConvertStringToObjectId } from '../../../entities/utils/convertStringToObjectId';
import { CurrentAPIUser } from '../../../webFrameworkCallbacks/abstractions/IHttpRequest';
import { AbstractCreateUsecase } from '../../abstractions/AbstractCreateUsecase';
import { MakeRequestTemplateParams } from '../../abstractions/AbstractUsecase';
import { CookieData, CookieHandler } from '../../utils/cookieHandler/cookieHandler';
import { EmailHandler } from '../../utils/emailHandler/emailHandler';
import { RedirectUrlBuilder } from '../../utils/redirectUrlBuilder/redirectUrlBuilder';
declare type OptionalCreateUserUsecaseInitParams = {
    makeUserEntity: Promise<UserEntity>;
    makePackageEntity: Promise<PackageEntity>;
    makePackageTransactionEntity: Promise<PackageTransactionEntity>;
    makeTeacherEntity: Promise<TeacherEntity>;
    makeTeacherDbService: Promise<TeacherDbService>;
    makePackageDbService: Promise<PackageDbService>;
    makePackageTransactionDbService: Promise<PackageTransactionDbService>;
    makeGraphDbService: Promise<GraphDbService>;
    makeCookieHandler: Promise<CookieHandler>;
    makeEmailHandler: Promise<EmailHandler>;
    makeRedirectUrlBuilder: RedirectUrlBuilder;
    convertStringToObjectId: ConvertStringToObjectId;
};
declare type CreateUserUsecaseResponse = {
    user: JoinedUserDoc;
    cookies: CookieData[];
    redirectUrl: string;
};
declare class CreateUserUsecase extends AbstractCreateUsecase<OptionalCreateUserUsecaseInitParams, CreateUserUsecaseResponse, UserDbServiceResponse> {
    private _userEntity;
    private _packageTransactionEntity;
    private _teacherEntity;
    private _packageTransactionDbService;
    private _emailHandler;
    private _redirectUrlBuilder;
    private _convertStringToObjectId;
    private _graphDbService;
    private _cookieHandler;
    protected _isSelf: (props: {
        params: any;
        currentAPIUser: CurrentAPIUser;
        endpointPath: string;
    }) => Promise<boolean>;
    protected _makeRequestTemplate: (props: MakeRequestTemplateParams) => Promise<CreateUserUsecaseResponse>;
    private _createDbUser;
    handleTeacherCreation: (props: {
        user: JoinedUserDoc;
        dbServiceAccessOptions: DbServiceAccessOptions;
    }) => Promise<JoinedUserDoc>;
    private _createTeacherData;
    private _createDbAdminPackageTransaction;
    private _createGraphAdminTeacherEdge;
    private _sendVerificationEmail;
    private _sendInternalEmail;
    protected _initTemplate: (optionalInitParams: OptionalCreateUserUsecaseInitParams) => Promise<void>;
}
export { CreateUserUsecase, CreateUserUsecaseResponse, CookieData };
