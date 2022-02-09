/// <reference types="mongoose" />
/// <reference types="mongoose-unique-validator/node_modules/@types/mongoose" />
/// <reference types="ts-mongoose/plugin" />
import { ExtractDoc } from 'ts-mongoose';
declare const TeacherSchema: import("mongoose").Schema<any, import("mongoose").Model<any, any, any, any>, {}> & {
    definition: {
        _id: import("mongoose").Types.ObjectId;
        type: string;
        tags: string[];
        createdDate: Date;
        lastModifiedDate: Date;
        teachingLanguages: {
            code?: string | undefined;
            level?: string | undefined;
        }[];
        alsoSpeaks: {
            code?: string | undefined;
            level?: string | undefined;
        }[];
        applicationStatus: string;
        settings: {
            isHidden: boolean;
            emailAlerts: {};
            payoutData: {
                email: import("ts-mongoose").Optional<string>;
            };
        };
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
        approvalDate?: Date | undefined;
        introductionVideoUrl?: string | undefined;
        licenseUrl?: string | undefined;
        __v: number;
    };
    options: import("mongoose").SchemaOptions;
};
declare const Teacher: import("mongoose").Model<import("mongoose").Document<any, any, any> & {
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
} & {}, {}, {}, {}> & {
    [name: string]: Function;
};
declare type TeacherDoc = ExtractDoc<typeof TeacherSchema>;
export { Teacher, TeacherSchema, TeacherDoc };
