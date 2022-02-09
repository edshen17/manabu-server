"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CHECKOUT_TOKEN_HASH_KEY = exports.CreatePackageTransactionCheckoutUsecase = void 0;
const constants_1 = require("../../../../../constants");
const IDbService_1 = require("../../../../dataAccess/abstractions/IDbService");
const cacheDbService_1 = require("../../../../dataAccess/services/cache/cacheDbService");
const balanceTransactionEntity_1 = require("../../../../entities/balanceTransaction/balanceTransactionEntity");
const IPaymentService_1 = require("../../../../payment/abstractions/IPaymentService");
const AbstractEntityValidator_1 = require("../../../../validators/abstractions/AbstractEntityValidator");
const AbstractCreateUsecase_1 = require("../../../abstractions/AbstractCreateUsecase");
const CHECKOUT_TOKEN_HASH_KEY = 'usercheckouttoken';
exports.CHECKOUT_TOKEN_HASH_KEY = CHECKOUT_TOKEN_HASH_KEY;
class CreatePackageTransactionCheckoutUsecase extends AbstractCreateUsecase_1.AbstractCreateUsecase {
    _paypalPaymentService;
    _stripePaymentService;
    _paynowPaymentService;
    _exchangeRateHandler;
    _cacheDbService;
    _redirectUrlBuilder;
    _jwtHandler;
    _packageTransactionCheckoutEntityValidator;
    _convertStringToObjectId;
    _convertToTitlecase;
    _makeRequestTemplate = async (props) => {
        const testBodyRes = await this._testBody(props);
        const packageTransactionCheckoutRes = await this._getPackageTransactionCheckoutResponse({
            ...props,
            ...testBodyRes,
        });
        return packageTransactionCheckoutRes;
    };
    _testBody = async (props) => {
        const { body, dbServiceAccessOptions } = props;
        const validatedBody = this._packageTransactionCheckoutEntityValidator.validate({
            buildParams: body,
            validationMode: AbstractEntityValidator_1.ENTITY_VALIDATOR_VALIDATE_MODE.CREATE,
            userRole: AbstractEntityValidator_1.ENTITY_VALIDATOR_VALIDATE_USER_ROLE.USER,
        });
        const { teacherId, packageId, lessonDuration, lessonLanguage, timeslots } = validatedBody;
        const teacher = await this._dbService.findById({
            _id: this._convertStringToObjectId(teacherId),
            dbServiceAccessOptions: { ...dbServiceAccessOptions, isReturningParent: true },
        });
        const teacherData = teacher.teacherData;
        const teacherPackage = teacherData.packages.find((pkg) => {
            return pkg._id.equals(this._convertStringToObjectId(packageId));
        });
        const isTeacherApproved = teacherData.applicationStatus == 'approved';
        const isValidLessonDuration = teacherPackage.lessonDurations.includes(lessonDuration);
        const isValidLessonLanguage = teacherData.teachingLanguages.findIndex((teachingLanguage) => {
            return teachingLanguage.code == lessonLanguage;
        }) != -1;
        const isValidBody = isTeacherApproved && isValidLessonDuration && isValidLessonLanguage;
        if (!isValidBody) {
            throw new Error('Invalid body.');
        }
        return { teacher, teacherData, teacherPackage, timeslots };
    };
    _getPackageTransactionCheckoutResponse = async (props) => {
        const { query } = props;
        const { paymentGateway } = query;
        const processedPaymentServiceParams = await this._getProcessedPaymentServiceParams(props);
        const { token } = processedPaymentServiceParams;
        let redirectUrl = '';
        switch (paymentGateway) {
            case IPaymentService_1.PAYMENT_GATEWAY_NAME.PAYPAL:
                redirectUrl = await this._getPaypalRedirectUrl(processedPaymentServiceParams);
                break;
            case IPaymentService_1.PAYMENT_GATEWAY_NAME.STRIPE:
                redirectUrl = await this._getStripeRedirectUrl(processedPaymentServiceParams);
                break;
            case IPaymentService_1.PAYMENT_GATEWAY_NAME.PAYNOW:
                redirectUrl = await this._getPaynowRedirectUrl(processedPaymentServiceParams);
                break;
            default:
                throw new Error('Invalid payment handler query.');
        }
        const packageTransactionCheckoutUsecaseRes = { redirectUrl, token };
        return packageTransactionCheckoutUsecaseRes;
    };
    _getProcessedPaymentServiceParams = async (props) => {
        const { body, currentAPIUser, teacher, teacherPackage, timeslots } = props;
        const { userId } = currentAPIUser;
        const token = `${userId}-${IDbService_1.DB_SERVICE_COLLECTION.PACKAGE_TRANSACTIONS}`;
        const processedPaymentServiceData = await this._getProcessedPaymentServiceData(props);
        const { item } = processedPaymentServiceData;
        await this._setTransactionJwt({
            body,
            teacherPackage,
            teacher,
            token,
            userId,
            timeslots,
            processedPaymentServiceData,
        });
        const successRedirectUrl = this._redirectUrlBuilder
            .host('client')
            .endpoint('/dashboard')
            .build();
        const cancelRedirectUrl = this._redirectUrlBuilder
            .host('client')
            .endpoint(`/user/${teacher._id}`)
            .build();
        const processedPaymentServiceParams = {
            item,
            successRedirectUrl,
            cancelRedirectUrl,
            currency: constants_1.DEFAULT_CURRENCY,
            token: token,
        };
        return processedPaymentServiceParams;
    };
    _getProcessedPaymentServiceData = async (props) => {
        const { teacher, teacherData, teacherPackage, currentAPIUser, query, body } = props;
        const { lessonDuration, lessonLanguage } = body;
        const { paymentGateway } = query;
        const { hourlyRate, currency } = teacherData.priceData;
        const lessonAmount = teacherPackage.lessonAmount;
        const subTotal = await this._exchangeRateHandler.multiply({
            multiplicand: {
                sourceCurrency: currency,
                amount: hourlyRate,
            },
            multiplier: {
                amount: (lessonDuration / 60) * lessonAmount * (1 - (0, constants_1.PACKAGE_DISCOUNT_RATE)(lessonAmount)),
            },
            targetCurrency: constants_1.DEFAULT_CURRENCY,
        });
        const total = subTotal + constants_1.PAYMENT_GATEWAY_FEE[paymentGateway.toUpperCase()](subTotal);
        const priceData = { currency: constants_1.DEFAULT_CURRENCY, subTotal, total };
        const item = {
            id: `teacher-${teacher._id}-student-${currentAPIUser.userId}-${lessonLanguage}`,
            name: this._convertToTitlecase(`Minato Manabu - ${teacherPackage.name} / ${teacher.name}`),
            price: total,
            quantity: 1,
        };
        const paymentData = {
            id: '',
            gateway: paymentGateway,
        };
        return { item, priceData, paymentData };
    };
    _setTransactionJwt = async (setPackageTransactionJwtParams) => {
        const { token, processedPaymentServiceData, userId, timeslots } = setPackageTransactionJwtParams;
        const packageTransactionEntityBuildParams = this._createPackageTransactionEntityBuildParams(setPackageTransactionJwtParams);
        const debitBalanceTransactionEntityBuildParams = this._createDebitBalanceTransactionEntityBuildParams({
            processedPaymentServiceData,
            userId: userId,
        });
        const jwt = this._jwtHandler.sign({
            toTokenObj: {
                packageTransactionEntityBuildParams,
                balanceTransactionEntityBuildParams: debitBalanceTransactionEntityBuildParams,
                timeslots,
            },
            expiresIn: '1d',
        });
        await this._cacheDbService.set({
            hashKey: CHECKOUT_TOKEN_HASH_KEY,
            key: token,
            value: jwt,
            ttlMs: cacheDbService_1.TTL_MS.DAY,
        });
    };
    _createPackageTransactionEntityBuildParams = (setPackageTransactionJwtParams) => {
        const { body, userId, teacher, teacherPackage } = setPackageTransactionJwtParams;
        const { packageId, lessonLanguage, lessonDuration } = body;
        const { lessonAmount } = teacherPackage;
        const packageTransactionEntityBuildParams = {
            hostedById: teacher._id,
            reservedById: userId,
            packageId,
            lessonDuration,
            lessonLanguage,
            remainingAppointments: lessonAmount,
            isSubscription: false,
        };
        return packageTransactionEntityBuildParams;
    };
    _createDebitBalanceTransactionEntityBuildParams = (props) => {
        const { processedPaymentServiceData, userId } = props;
        const { priceData, paymentData } = processedPaymentServiceData;
        const { currency, subTotal, total } = priceData;
        const processingFee = total - subTotal;
        const debitBalanceTransactionEntityBuildParams = {
            userId,
            status: balanceTransactionEntity_1.BALANCE_TRANSACTION_ENTITY_STATUS.COMPLETED,
            currency,
            type: balanceTransactionEntity_1.BALANCE_TRANSACTION_ENTITY_TYPE.PACKAGE_TRANSACTION,
            packageTransactionId: undefined,
            balanceChange: subTotal,
            processingFee,
            tax: 0,
            runningBalance: {
                currency,
                totalAvailable: 0, // set when actually building to reduce response time
            },
            paymentData,
        };
        return debitBalanceTransactionEntityBuildParams;
    };
    _getPaypalRedirectUrl = async (props) => {
        const { item, successRedirectUrl, cancelRedirectUrl, currency, token } = props;
        const { price, name, id, quantity } = item;
        const paymentHandlerExecuteParams = {
            successRedirectUrl,
            cancelRedirectUrl,
            items: [
                {
                    name: name,
                    sku: id,
                    price: price.toString(),
                    currency,
                    quantity: quantity,
                },
            ],
            currency,
            total: price,
            token,
        };
        const paypalCheckoutRes = await this._paypalPaymentService.executePayment(paymentHandlerExecuteParams);
        const { redirectUrl } = paypalCheckoutRes;
        return redirectUrl;
    };
    _getStripeRedirectUrl = async (props) => {
        const { item, successRedirectUrl, cancelRedirectUrl, currency, token } = props;
        const { price, name, quantity } = item;
        const stripePrice = await this._exchangeRateHandler.multiply({
            multiplicand: {
                amount: price,
            },
            multiplier: {
                amount: 100,
            },
            targetCurrency: '',
        });
        const paymentHandlerExecuteParams = {
            successRedirectUrl,
            cancelRedirectUrl,
            items: [
                {
                    price_data: {
                        currency: currency.toLowerCase(),
                        product_data: {
                            name,
                        },
                        unit_amount: stripePrice,
                    },
                    quantity: quantity,
                },
            ],
            currency,
            total: stripePrice,
            token,
        };
        const stripeCheckoutRes = await this._stripePaymentService.executePayment(paymentHandlerExecuteParams);
        const { redirectUrl } = stripeCheckoutRes;
        return redirectUrl;
    };
    _getPaynowRedirectUrl = async (props) => {
        const { item, successRedirectUrl, cancelRedirectUrl, currency, token } = props;
        const { price, name } = item;
        const paynowPrice = await this._exchangeRateHandler.multiply({
            multiplicand: {
                amount: price,
            },
            multiplier: {
                amount: 100,
            },
            targetCurrency: '',
        });
        const paymentHandlerExecuteParams = {
            successRedirectUrl,
            cancelRedirectUrl,
            items: {
                source: {
                    type: 'paynow',
                    amount: paynowPrice,
                    currency: currency.toLowerCase(),
                },
                charge: {
                    amount: paynowPrice,
                    currency: currency.toLowerCase(),
                    description: name,
                },
            },
            currency,
            total: price,
            token,
        };
        const paynowCheckoutRes = await this._paynowPaymentService.executePayment(paymentHandlerExecuteParams);
        const { redirectUrl } = paynowCheckoutRes;
        return redirectUrl;
    };
    _initTemplate = async (optionalInitParams) => {
        const { makePaypalPaymentService, makeStripePaymentService, makePaynowPaymentService, makeExchangeRateHandler, makeJwtHandler, makeCacheDbService, makePackageTransactionCheckoutEntityValidator, makeRedirectUrlBuilder, convertStringToObjectId, convertToTitlecase, } = optionalInitParams;
        this._paypalPaymentService = await makePaypalPaymentService;
        this._stripePaymentService = await makeStripePaymentService;
        this._paynowPaymentService = await makePaynowPaymentService;
        this._exchangeRateHandler = await makeExchangeRateHandler;
        this._jwtHandler = await makeJwtHandler;
        this._redirectUrlBuilder = makeRedirectUrlBuilder;
        this._cacheDbService = await makeCacheDbService;
        this._packageTransactionCheckoutEntityValidator = makePackageTransactionCheckoutEntityValidator;
        this._convertStringToObjectId = convertStringToObjectId;
        this._convertToTitlecase = convertToTitlecase;
    };
}
exports.CreatePackageTransactionCheckoutUsecase = CreatePackageTransactionCheckoutUsecase;
