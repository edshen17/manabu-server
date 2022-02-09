/// <reference types="mongoose" />
/// <reference types="mongoose-unique-validator/node_modules/@types/mongoose" />
/// <reference types="ts-mongoose/plugin" />
import { ExtractDoc } from 'ts-mongoose';
import { LocationData } from '../components/entities/utils/locationDataHandler/locationDataHandler';
import { PackageTransactionDoc } from './PackageTransaction';
import { JoinedUserDoc } from './User';
declare const AppointmentSchema: import("mongoose").Schema<any, import("mongoose").Model<any, any, any, any>, {}> & {
    definition: {
        _id: import("mongoose").Types.ObjectId;
        createdDate: Date;
        lastModifiedDate: Date;
        hostedById: any;
        reservedById: any;
        status: string;
        packageTransactionId: any;
        startDate: Date;
        endDate: Date;
        cancellationReason?: string | undefined;
        __v: number;
    };
    options: import("mongoose").SchemaOptions;
};
declare const Appointment: import("mongoose").Model<import("mongoose").Document<any, any, any> & {
    _id: import("mongoose").Types.ObjectId;
    createdDate: Date;
    lastModifiedDate: Date;
    __v: number;
    hostedById: any;
    reservedById: any;
    status: string;
    packageTransactionId: any;
    startDate: Date;
    endDate: Date;
    cancellationReason: string | undefined;
} & {
    hostedById?: unknown;
    reservedById?: unknown;
    packageTransactionId?: unknown;
}, {}, {}, {}> & {
    [name: string]: Function;
};
declare type AppointmentDoc = ExtractDoc<typeof AppointmentSchema> & {
    packageTransactionData: PackageTransactionDoc;
    locationData: LocationData;
    hostedByData: JoinedUserDoc;
    reservedByData: JoinedUserDoc;
};
export { Appointment, AppointmentSchema, AppointmentDoc };
