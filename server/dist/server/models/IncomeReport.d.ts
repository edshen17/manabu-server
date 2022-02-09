/// <reference types="mongoose" />
/// <reference types="mongoose-unique-validator/node_modules/@types/mongoose" />
/// <reference types="ts-mongoose/plugin" />
import { ExtractDoc } from 'ts-mongoose';
declare const IncomeReportSchema: import("mongoose").Schema<any, import("mongoose").Model<any, any, any, any>, {}> & {
    definition: {
        _id: import("mongoose").Types.ObjectId;
        createdDate: Date;
        lastModifiedDate: Date;
        currency: string;
        startDate: Date;
        endDate: Date;
        revenue: number;
        wageExpense: number;
        rentExpense: number;
        advertisingExpense: number;
        depreciationExpense: number;
        suppliesExpense: number;
        internetExpense: number;
        totalExpense: number;
        netIncome: number;
        dateRangeKey: string;
        __v: number;
    };
    options: import("mongoose").SchemaOptions;
};
declare const IncomeReport: import("mongoose").Model<import("mongoose").Document<any, any, any> & {
    _id: import("mongoose").Types.ObjectId;
    createdDate: Date;
    lastModifiedDate: Date;
    __v: number;
    currency: string;
    startDate: Date;
    endDate: Date;
    revenue: number;
    wageExpense: number;
    rentExpense: number;
    advertisingExpense: number;
    depreciationExpense: number;
    suppliesExpense: number;
    internetExpense: number;
    totalExpense: number;
    netIncome: number;
    dateRangeKey: string;
} & {}, {}, {}, {}> & {
    [name: string]: Function;
};
declare type IncomeReportDoc = ExtractDoc<typeof IncomeReportSchema>;
export { IncomeReport, IncomeReportSchema, IncomeReportDoc };
