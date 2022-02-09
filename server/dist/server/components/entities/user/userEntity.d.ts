import { UserContactMethodEmbed, UserEmailAlertsEmbed } from '../../../models/User';
import { PackageEntityValidator } from '../../validators/package/entity/packageEntityValidator';
import { TeacherEntityValidator } from '../../validators/teacher/entity/teacherEntityValidator';
import { AbstractEntity } from '../abstractions/AbstractEntity';
import { TeacherEntityBuildResponse } from '../teacher/teacherEntity';
import { NGramHandler } from '../utils/nGramHandler/nGramHandler';
declare type OptionalUserEntityInitParams = {
    hashPassword: any;
    cryptoRandomString: any;
    signJwt: any;
    makeTeacherEntityValidator: TeacherEntityValidator;
    makePackageEntityValidator: PackageEntityValidator;
    makeNGramHandler: NGramHandler;
};
declare type UserEntityBuildParams = {
    name: string;
    email: string;
    password?: string;
    profileImageUrl?: string;
    contactMethods?: UserContactMethod[] | [];
    teacherData?: TeacherEntityBuildResponse;
};
declare type UserContactMethod = typeof UserContactMethodEmbed;
declare type UserEmailAlerts = typeof UserEmailAlertsEmbed;
declare enum USER_ENTITY_EMAIL_ALERT {
    APPOINTMENT_CREATION = "appointmentCreation",
    APPOINTMENT_UPDATE = "appointmentUpdate",
    APPOINTMENT_START_REMINDER = "appointmentStartReminder",
    PACKAGE_TRANSACTION_CREATION = "packageTransactionCreation"
}
declare type UserEntityBuildResponse = {
    name: string;
    email: string;
    password?: string;
    profileImageUrl: string;
    profileBio: string;
    createdDate: Date;
    languages?: {
        level: string;
        code: string;
    }[];
    region: string;
    timezone: string;
    lastOnlineDate: Date;
    role: string;
    settings: {
        currency: string;
        locale: string;
        emailAlerts: UserEmailAlerts;
    };
    memberships: {
        name: string;
        createdDate: Date;
    }[];
    contactMethods: UserContactMethod[] | [];
    isEmailVerified: boolean;
    verificationToken: string;
    lastModifiedDate: Date;
    nameNGrams: string;
    namePrefixNGrams: string;
    balance: {
        totalCurrent: number;
        totalPending: number;
        totalAvailable: number;
        currency: string;
    };
    teacherData?: TeacherEntityBuildResponse;
};
declare class UserEntity extends AbstractEntity<OptionalUserEntityInitParams, UserEntityBuildParams, UserEntityBuildResponse> {
    private _hashPassword;
    private _cryptoRandomString;
    private _signJwt;
    private _teacherEntityValidator;
    private _packageEntityValidator;
    private _nGramHandler;
    protected _validate: (buildParams: UserEntityBuildParams) => void;
    protected _buildTemplate: (buildParams: UserEntityBuildParams) => UserEntityBuildResponse;
    private _encryptPassword;
    private _createVerificationToken;
    protected _initTemplate: (optionalInitParams: OptionalUserEntityInitParams) => Promise<void>;
}
export { UserEntity, UserEntityBuildParams, UserEntityBuildResponse, UserContactMethod, USER_ENTITY_EMAIL_ALERT, };
