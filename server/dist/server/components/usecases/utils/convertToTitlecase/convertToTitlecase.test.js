"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const _1 = require(".");
describe('convertToTitlecase', () => {
    it('should titlecase the given string', () => {
        const convertedString = (0, _1.convertToTitlecase)('converted string');
        (0, chai_1.expect)(convertedString).to.equal('Converted String');
    });
});
