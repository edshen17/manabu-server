import { JoinedUserDoc } from '../../../../models/User';
import { StringKeyObject } from '../../../../types/custom';
import { AbstractDbService } from '../../abstractions/AbstractDbService';
declare type OptionalUserDbServiceInitParams = {
    comparePassword: any;
};
declare type UserDbServiceResponse = JoinedUserDoc;
declare class UserDbService extends AbstractDbService<OptionalUserDbServiceInitParams, UserDbServiceResponse> {
    private _comparePassword;
    protected _getDbServiceModelViews: () => {
        defaultView: {
            email: number;
            password: number;
            verificationToken: number;
            settings: number;
            contactMethods: number;
            isEmailVerified: number;
            nameNGrams: number;
            namePrefixNGrams: number;
            balance: number;
            'teacherData.licenseUrl': number;
            'teacherData.settings': number;
        };
        adminView: {
            password: number;
            verificationToken: number;
            nameNGrams: number;
            namePrefixNGrams: number;
        };
        selfView: {
            password: number;
            verificationToken: number;
            nameNGrams: number;
            namePrefixNGrams: number;
        };
        overrideView: {};
    };
    authenticateUser: (props: {
        searchQuery: StringKeyObject;
        password: string;
    }) => Promise<JoinedUserDoc | undefined>;
    protected _initTemplate: (optionalDbServiceInitParams: OptionalUserDbServiceInitParams) => Promise<void>;
}
export { UserDbService, UserDbServiceResponse };
