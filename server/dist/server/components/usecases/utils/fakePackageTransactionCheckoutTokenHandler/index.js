"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeFakePackageTransactionCheckoutTokenHandler = void 0;
const dayjs_1 = __importDefault(require("dayjs"));
const fakeDbAvailableTimeFactory_1 = require("../../../dataAccess/testFixtures/fakeDbAvailableTimeFactory");
const fakeDbUserFactory_1 = require("../../../dataAccess/testFixtures/fakeDbUserFactory");
const createPackageTransactionCheckoutUsecase_1 = require("../../checkout/packageTransaction/createPackageTransactionCheckoutUsecase");
const controllerDataBuilder_1 = require("../controllerDataBuilder");
const fakePackageTransactionCheckoutTokenHandler_1 = require("./fakePackageTransactionCheckoutTokenHandler");
const makeFakePackageTransactionCheckoutTokenHandler = new fakePackageTransactionCheckoutTokenHandler_1.FakePackageTransactionCheckoutTokenHandler().init({
    makeFakeDbUserFactory: fakeDbUserFactory_1.makeFakeDbUserFactory,
    makeControllerDataBuilder: controllerDataBuilder_1.makeControllerDataBuilder,
    makeCreatePackageTransactionCheckoutUsecase: createPackageTransactionCheckoutUsecase_1.makeCreatePackageTransactionCheckoutUsecase,
    makeFakeDbAvailableTimeFactory: fakeDbAvailableTimeFactory_1.makeFakeDbAvailableTimeFactory,
    dayjs: dayjs_1.default,
});
exports.makeFakePackageTransactionCheckoutTokenHandler = makeFakePackageTransactionCheckoutTokenHandler;
