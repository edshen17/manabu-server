/// <reference types="mongoose" />
/// <reference types="mongoose-unique-validator/node_modules/@types/mongoose" />
/// <reference types="ts-mongoose/plugin" />
import { ExtractDoc } from 'ts-mongoose';
declare const UserContactMethodEmbed: {
    name: string;
    address: string;
    isPrimaryMethod: boolean;
    type: string;
};
declare const UserEmailAlertsEmbed: {
    packageTransactionCreation: boolean;
    appointmentCreation: boolean;
    appointmentUpdate: boolean;
    appointmentStartReminder: boolean;
};
declare const UserSchema: import("mongoose").Schema<any, import("mongoose").Model<any, any, any, any>, {}> & {
    definition: {
        _id: import("mongoose").Types.ObjectId;
        name: string;
        createdDate: Date;
        lastModifiedDate: Date;
        settings: {
            emailAlerts: {
                packageTransactionCreation: boolean;
                appointmentCreation: boolean;
                appointmentUpdate: boolean;
                appointmentStartReminder: boolean;
            };
            currency: string;
            locale: string;
        };
        email: string;
        languages: {
            code: string;
            level: string;
        }[];
        role: string;
        memberships: {
            name?: string | undefined;
            createdDate?: Date | undefined;
        }[];
        contactMethods: {
            type: string;
            name: string;
            address: string;
            isPrimaryMethod: boolean;
        }[];
        isEmailVerified: boolean;
        verificationToken: string;
        nameNGrams: string;
        namePrefixNGrams: string;
        lastOnlineDate: Date;
        balance: {
            currency: string;
            totalCurrent: number;
            totalPending: number;
            totalAvailable: number;
        };
        password?: string | undefined;
        profileImageUrl?: string | undefined;
        profileBio?: string | undefined;
        region?: string | undefined;
        timezone?: string | undefined;
        teacherData?: ({
            type: string;
            _id: import("mongoose").Types.ObjectId;
            tags: string[];
            createdDate: Date;
            lastModifiedDate: Date;
            __v: number;
            approvalDate: Date | undefined;
            teachingLanguages: {
                code?: string | undefined;
                level?: string | undefined;
            }[];
            alsoSpeaks: {
                code?: string | undefined;
                level?: string | undefined;
            }[];
            introductionVideoUrl: string | undefined;
            applicationStatus: string;
            settings: {
                isHidden: boolean;
                emailAlerts: {};
                payoutData: {
                    email: import("ts-mongoose").Optional<string>;
                };
            };
            licenseUrl: string | undefined;
            priceData: {
                hourlyRate: number;
                currency: string;
            };
            lessonCount: number;
            studentCount: number;
            packages: import("ts-mongoose/types/_shared").SubDocumentArray<{
                lessonAmount: number;
                type: string;
                description: string | undefined;
                name: string;
                isOffering: boolean;
                lessonDurations: number[];
                _id: import("mongoose").Types.ObjectId;
                tags: string[] | undefined;
                createdDate: Date;
                lastModifiedDate: Date;
                __v: number;
            } & {} & import("ts-mongoose/types/_shared").SubDocument>;
        } & {} & import("ts-mongoose/types/_shared").SubDocument) | undefined;
        __v: number;
    };
    options: import("mongoose").SchemaOptions;
};
declare const User: import("mongoose").Model<import("mongoose").Document<any, any, any> & {
    name: string;
    _id: import("mongoose").Types.ObjectId;
    createdDate: Date;
    lastModifiedDate: Date;
    __v: number;
    settings: {
        emailAlerts: {
            packageTransactionCreation: boolean;
            appointmentCreation: boolean;
            appointmentUpdate: boolean;
            appointmentStartReminder: boolean;
        };
        currency: string;
        locale: string;
    };
    email: string;
    password: string | undefined;
    profileImageUrl: string | undefined;
    profileBio: string | undefined;
    languages: {
        code: string;
        level: string;
    }[];
    region: string | undefined;
    timezone: string | undefined;
    role: string;
    memberships: {
        name?: string | undefined;
        createdDate?: Date | undefined;
    }[];
    contactMethods: {
        type: string;
        name: string;
        address: string;
        isPrimaryMethod: boolean;
    }[];
    isEmailVerified: boolean;
    verificationToken: string;
    teacherData: ({
        type: string;
        _id: import("mongoose").Types.ObjectId;
        tags: string[];
        createdDate: Date;
        lastModifiedDate: Date;
        __v: number;
        approvalDate: Date | undefined;
        teachingLanguages: {
            code?: string | undefined;
            level?: string | undefined;
        }[];
        alsoSpeaks: {
            code?: string | undefined;
            level?: string | undefined;
        }[];
        introductionVideoUrl: string | undefined;
        applicationStatus: string;
        settings: {
            isHidden: boolean;
            emailAlerts: {};
            payoutData: {
                email: import("ts-mongoose").Optional<string>;
            };
        };
        licenseUrl: string | undefined;
        priceData: {
            hourlyRate: number;
            currency: string;
        };
        lessonCount: number;
        studentCount: number;
        packages: import("ts-mongoose/types/_shared").SubDocumentArray<{
            lessonAmount: number;
            type: string;
            description: string | undefined;
            name: string;
            isOffering: boolean;
            lessonDurations: number[];
            _id: import("mongoose").Types.ObjectId;
            tags: string[] | undefined;
            createdDate: Date;
            lastModifiedDate: Date;
            __v: number;
        } & {} & import("ts-mongoose/types/_shared").SubDocument>;
    } & {} & import("ts-mongoose/types/_shared").SubDocument) | undefined;
    nameNGrams: string;
    namePrefixNGrams: string;
    lastOnlineDate: Date;
    balance: {
        currency: string;
        totalCurrent: number;
        totalPending: number;
        totalAvailable: number;
    };
} & {}, {}, {}, {}> & {
    [name: string]: Function;
};
declare type JoinedUserDoc = ExtractDoc<typeof UserSchema>;
export { User, UserSchema, JoinedUserDoc, UserContactMethodEmbed, UserEmailAlertsEmbed };
