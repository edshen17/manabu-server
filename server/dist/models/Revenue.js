"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RevenueSchema = exports.Revenue = void 0;
const ts_mongoose_1 = require("ts-mongoose");
const RevenueSchema = ts_mongoose_1.createSchema({
    revenue: ts_mongoose_1.Type.object({ required: true }),
    date: ts_mongoose_1.Type.string({ required: true }),
});
exports.RevenueSchema = RevenueSchema;
const Revenue = ts_mongoose_1.typedModel('Revenue', RevenueSchema);
exports.Revenue = Revenue;
