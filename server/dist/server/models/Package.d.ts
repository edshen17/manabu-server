/// <reference types="mongoose" />
/// <reference types="mongoose-unique-validator/node_modules/@types/mongoose" />
/// <reference types="ts-mongoose/plugin" />
import { ExtractDoc } from 'ts-mongoose';
declare const PackageSchema: import("mongoose").Schema<any, import("mongoose").Model<any, any, any, any>, {}> & {
    definition: {
        _id: import("mongoose").Types.ObjectId;
        lessonAmount: number;
        type: string;
        name: string;
        isOffering: boolean;
        lessonDurations: number[];
        createdDate: Date;
        lastModifiedDate: Date;
        description?: string | undefined;
        tags?: string[] | undefined;
        __v: number;
    };
    options: import("mongoose").SchemaOptions;
};
declare const Package: import("mongoose").Model<import("mongoose").Document<any, any, any> & {
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
} & {}, {}, {}, {}> & {
    [name: string]: Function;
};
declare type PackageDoc = ExtractDoc<typeof PackageSchema>;
export { Package, PackageSchema, PackageDoc };
