"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const dayjs_1 = __importDefault(require("dayjs"));
const _1 = require(".");
let dateRangeKeyHandler;
let startDate;
let endDate;
before(() => {
    dateRangeKeyHandler = _1.makeDateRangeKeyHandler;
});
beforeEach(() => {
    startDate = (0, dayjs_1.default)().day(0);
    endDate = (0, dayjs_1.default)().date((0, dayjs_1.default)().daysInMonth());
});
describe('dateRangeKeyHandler', () => {
    describe('createKey', () => {
        it('should create a key given 2 valid dates', () => {
            const { dateRangeKey } = dateRangeKeyHandler.createKey({
                startDate: startDate.toDate(),
                endDate: endDate.toDate(),
            });
            (0, chai_1.expect)(dateRangeKey).to.equal(`${startDate.format('MM/DD/YYYY')}-${endDate.format('MM/DD/YYYY')}`);
        });
    });
});
