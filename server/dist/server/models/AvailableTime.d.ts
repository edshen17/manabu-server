/// <reference types="mongoose" />
/// <reference types="mongoose-unique-validator/node_modules/@types/mongoose" />
/// <reference types="ts-mongoose/plugin" />
import { ExtractDoc } from 'ts-mongoose';
declare const AvailableTimeSchema: import("mongoose").Schema<any, import("mongoose").Model<any, any, any, any>, {}> & {
    definition: {
        _id: import("mongoose").Types.ObjectId;
        createdDate: Date;
        lastModifiedDate: Date;
        hostedById: any;
        startDate: Date;
        endDate: Date;
        __v: number;
    };
    options: import("mongoose").SchemaOptions;
};
declare const AvailableTime: import("mongoose").Model<import("mongoose").Document<any, any, any> & {
    _id: import("mongoose").Types.ObjectId;
    createdDate: Date;
    lastModifiedDate: Date;
    __v: number;
    hostedById: any;
    startDate: Date;
    endDate: Date;
} & {
    hostedById?: unknown;
}, {}, {}, {}> & {
    [name: string]: Function;
};
declare type AvailableTimeDoc = ExtractDoc<typeof AvailableTimeSchema>;
export { AvailableTime, AvailableTimeSchema, AvailableTimeDoc };
