/// <reference types="mongoose" />
/// <reference types="mongoose-unique-validator/node_modules/@types/mongoose" />
/// <reference types="ts-mongoose/plugin" />
import { ExtractDoc } from 'ts-mongoose';
import { PackageDoc } from './Package';
import { JoinedUserDoc } from './User';
declare const PackageTransactionSchema: import("mongoose").Schema<any, import("mongoose").Model<any, any, any, any>, {}> & {
    definition: {
        _id: import("mongoose").Types.ObjectId;
        createdDate: Date;
        lastModifiedDate: Date;
        hostedById: any;
        reservedById: any;
        packageId: any;
        lessonDuration: number;
        terminationDate: Date;
        isTerminated: boolean;
        remainingAppointments: number;
        lessonLanguage: string;
        isSubscription: boolean;
        status: string;
        __v: number;
    };
    options: import("mongoose").SchemaOptions;
};
declare const PackageTransaction: import("mongoose").Model<import("mongoose").Document<any, any, any> & {
    _id: import("mongoose").Types.ObjectId;
    createdDate: Date;
    lastModifiedDate: Date;
    __v: number;
    hostedById: any;
    reservedById: any;
    packageId: any;
    lessonDuration: number;
    terminationDate: Date;
    isTerminated: boolean;
    remainingAppointments: number;
    lessonLanguage: string;
    isSubscription: boolean;
    status: string;
} & {
    hostedById?: unknown;
    reservedById?: unknown;
    packageId?: unknown;
}, {}, {}, {}> & {
    [name: string]: Function;
};
declare type PackageTransactionDoc = ExtractDoc<typeof PackageTransactionSchema> & {
    packageData: PackageDoc;
    hostedByData: JoinedUserDoc;
    reservedByData: JoinedUserDoc;
};
export { PackageTransaction, PackageTransactionSchema, PackageTransactionDoc };
