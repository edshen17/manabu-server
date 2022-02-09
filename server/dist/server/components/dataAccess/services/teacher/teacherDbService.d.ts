import { TeacherDoc } from '../../../../models/Teacher';
import { JoinedUserDoc } from '../../../../models/User';
import { AbstractEmbeddedDbService, AbstractEmbeddedDbServiceInitParams } from '../../abstractions/AbstractEmbeddedDbService';
declare type OptionalTeacherDbServiceInitParams = {};
declare type TeacherDbServiceResponse = TeacherDoc | JoinedUserDoc;
declare class TeacherDbService extends AbstractEmbeddedDbService<OptionalTeacherDbServiceInitParams, TeacherDbServiceResponse> {
    protected _initTemplate: (optionalDbServiceInitParams: AbstractEmbeddedDbServiceInitParams<OptionalTeacherDbServiceInitParams>) => Promise<void>;
}
export { TeacherDbService, TeacherDbServiceResponse };
