import { JoinedUserDoc } from '../../../../models/User';
import { UserEntityBuildParams, UserEntityBuildResponse } from '../../../entities/user/userEntity';
import { GraphDbService } from '../../services/graph/graphDbService';
import { AbstractFakeDbDataFactory } from '../abstractions/AbstractFakeDbDataFactory';
import { FakeDbTeacherFactory } from '../fakeDbTeacherFactory/fakeDbTeacherFactory';
declare type OptionalFakeDbUserFactoryInitParams = {
    faker: any;
    makeFakeDbTeacherFactory: Promise<FakeDbTeacherFactory>;
    makeGraphDbService: Promise<GraphDbService>;
};
declare class FakeDbUserFactory extends AbstractFakeDbDataFactory<OptionalFakeDbUserFactoryInitParams, UserEntityBuildParams, UserEntityBuildResponse, JoinedUserDoc> {
    private _faker;
    private _fakeDbTeacherFactory;
    private _graphDbService;
    createFakeDbTeacher: () => Promise<JoinedUserDoc>;
    createFakeDbUser: () => Promise<JoinedUserDoc>;
    protected _createFakeBuildParams: () => Promise<UserEntityBuildParams>;
    protected _initTemplate: (optionalInitParams: OptionalFakeDbUserFactoryInitParams) => Promise<void>;
}
export { FakeDbUserFactory };
