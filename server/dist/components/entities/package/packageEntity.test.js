"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = __importDefault(require("chai"));
const index_1 = require("./index");
const expect = chai_1.default.expect;
const assert = chai_1.default.assert;
let testPackageEntityProperties;
beforeEach(() => {
    testPackageEntityProperties = {
        hostedBy: 'some hostedBy',
        priceDetails: {},
        lessonAmount: 5,
        isOffering: true,
        packageDurations: [],
        packageType: 'light',
    };
});
context('package entity', () => {
    describe('build', () => {
        describe('given valid inputs', () => {
            it('should return given inputs', () => {
                const testPackage = index_1.makePackageEntity.build(testPackageEntityProperties);
                expect(testPackage.hostedBy).to.equal('some hostedBy');
                expect(testPackage.lessonAmount).to.equal(5);
                expect(testPackage.isOffering).to.equal(true);
                expect(testPackage.packageDurations.length).to.equal(0);
                expect(testPackage.packageType).to.equal('light');
                assert.deepEqual(testPackage.priceDetails, {});
            });
            it('should return given inputs and default values if not given', () => {
                testPackageEntityProperties.isOffering = undefined;
                testPackageEntityProperties.packageDurations = undefined;
                const testPackage = index_1.makePackageEntity.build(testPackageEntityProperties);
                expect(testPackage.packageDurations.length).to.equal(2);
                expect(testPackage.isOffering).to.equal(true);
            });
        });
    });
});
