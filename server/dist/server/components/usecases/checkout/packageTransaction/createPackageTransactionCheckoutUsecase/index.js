"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeCreatePackageTransactionCheckoutUsecase = void 0;
const clone_deep_1 = __importDefault(require("clone-deep"));
const deep_equal_1 = __importDefault(require("deep-equal"));
const cache_1 = require("../../../../dataAccess/services/cache");
const teacher_1 = require("../../../../dataAccess/services/teacher");
const convertStringToObjectId_1 = require("../../../../entities/utils/convertStringToObjectId");
const paynow_1 = require("../../../../payment/services/paynow");
const paypal_1 = require("../../../../payment/services/paypal");
const stripe_1 = require("../../../../payment/services/stripe");
const params_1 = require("../../../../validators/base/params");
const entity_1 = require("../../../../validators/checkout/packageTransaction/entity");
const query_1 = require("../../../../validators/checkout/packageTransaction/query");
const convertToTitlecase_1 = require("../../../utils/convertToTitlecase");
const exchangeRateHandler_1 = require("../../../utils/exchangeRateHandler");
const jwtHandler_1 = require("../../../utils/jwtHandler");
const redirectUrlBuilder_1 = require("../../../utils/redirectUrlBuilder");
const createPackageTransactionCheckoutUsecase_1 = require("./createPackageTransactionCheckoutUsecase");
const makeCreatePackageTransactionCheckoutUsecase = new createPackageTransactionCheckoutUsecase_1.CreatePackageTransactionCheckoutUsecase().init({
    makeDbService: teacher_1.makeTeacherDbService,
    makeParamsValidator: params_1.makeBaseParamsValidator,
    makeQueryValidator: query_1.makePackageTransactionCheckoutQueryValidator,
    makePackageTransactionCheckoutEntityValidator: entity_1.makePackageTransactionCheckoutEntityValidator,
    cloneDeep: clone_deep_1.default,
    deepEqual: deep_equal_1.default,
    makePaypalPaymentService: paypal_1.makePaypalPaymentService,
    makeStripePaymentService: stripe_1.makeStripePaymentService,
    makeRedirectUrlBuilder: redirectUrlBuilder_1.makeRedirectUrlBuilder,
    convertStringToObjectId: convertStringToObjectId_1.convertStringToObjectId,
    convertToTitlecase: convertToTitlecase_1.convertToTitlecase,
    makeExchangeRateHandler: exchangeRateHandler_1.makeExchangeRateHandler,
    makePaynowPaymentService: paynow_1.makePaynowPaymentService,
    makeJwtHandler: jwtHandler_1.makeJwtHandler,
    makeCacheDbService: cache_1.makeCacheDbService,
});
exports.makeCreatePackageTransactionCheckoutUsecase = makeCreatePackageTransactionCheckoutUsecase;
