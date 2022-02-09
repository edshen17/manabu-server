"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const _1 = require(".");
let nGramHandler;
before(() => {
    nGramHandler = _1.makeNGramHandler;
});
describe('createEdgeNGrams', () => {
    it('should create edge n-grams for the given string', () => {
        const str = 'Mississippi River';
        context('isOnlyPrefix', () => {
            const nGrams = nGramHandler.createEdgeNGrams({ str, isPrefixOnly: true });
            (0, chai_1.expect)(nGrams).to.equal('M Mi Mis Miss Missi Missis Mississ Mississi Mississip Mississipp Mississippi');
        });
        context('default', () => {
            const nGrams = nGramHandler.createEdgeNGrams({ str, isPrefixOnly: false });
            (0, chai_1.expect)(nGrams).to.equal('M Mi Mis Miss Missi Missis Mississ Mississi Mississip Mississipp Mississippi R Ri Riv Rive River');
        });
    });
});
