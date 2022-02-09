/// <reference types="mongoose" />
/// <reference types="mongoose-unique-validator/node_modules/@types/mongoose" />
/// <reference types="ts-mongoose/plugin" />
import { ExtractDoc } from 'ts-mongoose';
import { PackageTransactionDoc } from './PackageTransaction';
declare const BalanceTransactionSchema: import("mongoose").Schema<any, import("mongoose").Model<any, any, any, any>, {}> & {
    definition: {
        _id: import("mongoose").Types.ObjectId;
        type: string;
        createdDate: Date;
        lastModifiedDate: Date;
        currency: string;
        status: string;
        packageTransactionId: any;
        userId: any;
        balanceChange: number;
        processingFee: number;
        tax: number;
        totalPayment: number;
        runningBalance: {
            currency: string;
            totalAvailable: number;
        };
        paymentData?: {
            id?: string | undefined;
            gateway?: string | undefined;
        } | undefined;
        __v: number;
    };
    options: import("mongoose").SchemaOptions;
};
declare const BalanceTransaction: import("mongoose").Model<import("mongoose").Document<any, any, any> & {
    type: string;
    _id: import("mongoose").Types.ObjectId;
    createdDate: Date;
    lastModifiedDate: Date;
    __v: number;
    currency: string;
    status: string;
    packageTransactionId: any;
    userId: any;
    balanceChange: number;
    processingFee: number;
    tax: number;
    totalPayment: number;
    runningBalance: {
        currency: string;
        totalAvailable: number;
    };
    paymentData: {
        id?: string | undefined;
        gateway?: string | undefined;
    } | undefined;
} & {
    packageTransactionId?: unknown;
    userId?: unknown;
}, {}, {}, {}> & {
    [name: string]: Function;
};
declare type BalanceTransactionDoc = ExtractDoc<typeof BalanceTransactionSchema> & {
    packageTransactionData: PackageTransactionDoc;
};
export { BalanceTransaction, BalanceTransactionSchema, BalanceTransactionDoc };
