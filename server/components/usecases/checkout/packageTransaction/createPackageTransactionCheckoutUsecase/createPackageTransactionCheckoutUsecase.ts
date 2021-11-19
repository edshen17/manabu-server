import { ObjectId } from 'mongoose';
import { DEFAULT_CURRENCY, PAYMENT_GATEWAY_RATE } from '../../../../../constants';
import { PackageDoc } from '../../../../../models/Package';
import { JoinedUserDoc } from '../../../../../models/User';
import { Await, StringKeyObject } from '../../../../../types/custom';
import {
  DbServiceAccessOptions,
  DB_SERVICE_COLLECTIONS,
} from '../../../../dataAccess/abstractions/IDbService';
import { CacheDbService, TTL_MS } from '../../../../dataAccess/services/cache/cacheDbService';
import { TeacherDbServiceResponse } from '../../../../dataAccess/services/teacher/teacherDbService';
import {
  BalanceTransactionEntityBuildParams,
  BALANCE_TRANSACTION_ENTITY_STATUS,
  BALANCE_TRANSACTION_ENTITY_TYPE,
} from '../../../../entities/balanceTransaction/balanceTransactionEntity';
import { PackageTransactionEntityBuildParams } from '../../../../entities/packageTransaction/packageTransactionEntity';
import { ConvertStringToObjectId } from '../../../../entities/utils/convertStringToObjectId';
import {
  PaymentServiceExecuteParams,
  PAYMENT_GATEWAY_NAME,
} from '../../../../payment/abstractions/IPaymentService';
import { PaynowPaymentService } from '../../../../payment/services/paynow/paynowPaymentService';
import { PaypalPaymentService } from '../../../../payment/services/paypal/paypalPaymentService';
import { StripePaymentService } from '../../../../payment/services/stripe/stripePaymentService';
import {
  ENTITY_VALIDATOR_VALIDATE_MODES,
  ENTITY_VALIDATOR_VALIDATE_USER_ROLES,
} from '../../../../validators/abstractions/AbstractEntityValidator';
import { PackageTransactionCheckoutEntityValidator } from '../../../../validators/checkout/packageTransaction/entity/packageTransactionCheckoutEntityValidator';
import { AbstractCreateUsecase } from '../../../abstractions/AbstractCreateUsecase';
import { MakeRequestTemplateParams } from '../../../abstractions/AbstractUsecase';
import { ConvertToTitlecase } from '../../../utils/convertToTitlecase';
import { ExchangeRateHandler } from '../../../utils/exchangeRateHandler/exchangeRateHandler';
import { JwtHandler } from '../../../utils/jwtHandler/jwtHandler';

type OptionalCreatePackageTransactionCheckoutUsecaseInitParams = {
  makePaypalPaymentService: Promise<PaypalPaymentService>;
  makeStripePaymentService: Promise<StripePaymentService>;
  makePaynowPaymentService: Promise<PaynowPaymentService>;
  makeExchangeRateHandler: Promise<ExchangeRateHandler>;
  makeJwtHandler: Promise<JwtHandler>;
  makeCacheDbService: Promise<CacheDbService>;
  makePackageTransactionCheckoutEntityValidator: PackageTransactionCheckoutEntityValidator;
  convertStringToObjectId: ConvertStringToObjectId;
  convertToTitlecase: ConvertToTitlecase;
};

type CreatePackageTransactionCheckoutUsecaseResponse = {
  redirectUrl: string;
  token: string;
};

type GetRedirectUrlParams = MakeRequestTemplateParams & TestBodyResponse;

type TestBodyResponse = {
  teacher: JoinedUserDoc;
  teacherData: JoinedUserDoc['teacherData'];
  teacherPackage: PackageDoc;
};

type GetPaymentServiceRedirectUrlParams = Await<
  ReturnType<CreatePackageTransactionCheckoutUsecase['_getProcessedPaymentServiceParams']>
>;

type SetPackageTransactionJwtParams = {
  teacherPackage: PackageDoc;
  body: StringKeyObject;
  userId?: ObjectId;
  token: string;
  teacher: JoinedUserDoc;
  processedPaymentServiceData: ProcessedPaymentServiceData;
};

type ProcessedPaymentServiceData = Await<
  ReturnType<CreatePackageTransactionCheckoutUsecase['_getProcessedPaymentServiceData']>
>;

const CHECKOUT_TOKEN_HASH_KEY = 'usercheckouttoken';

class CreatePackageTransactionCheckoutUsecase extends AbstractCreateUsecase<
  OptionalCreatePackageTransactionCheckoutUsecaseInitParams,
  CreatePackageTransactionCheckoutUsecaseResponse,
  TeacherDbServiceResponse
> {
  private _paypalPaymentService!: PaypalPaymentService;
  private _stripePaymentService!: StripePaymentService;
  private _paynowPaymentService!: PaynowPaymentService;
  private _exchangeRateHandler!: ExchangeRateHandler;
  private _cacheDbService!: CacheDbService;
  private _jwtHandler!: JwtHandler;
  private _packageTransactionCheckoutEntityValidator!: PackageTransactionCheckoutEntityValidator;
  private _convertStringToObjectId!: ConvertStringToObjectId;
  private _convertToTitlecase!: ConvertToTitlecase;
  private _defaultCurrency: string = DEFAULT_CURRENCY;

  protected _makeRequestTemplate = async (
    props: MakeRequestTemplateParams
  ): Promise<CreatePackageTransactionCheckoutUsecaseResponse> => {
    const testBodyRes = await this._testBody(props);
    const packageTransactionCheckoutRes = await this._getPackageTransactionCheckoutResponse({
      ...props,
      ...testBodyRes,
    });
    return packageTransactionCheckoutRes;
  };

  private _testBody = async (props: {
    body: StringKeyObject;
    dbServiceAccessOptions: DbServiceAccessOptions;
  }): Promise<TestBodyResponse> => {
    const { body, dbServiceAccessOptions } = props;
    const validatedBody = this._packageTransactionCheckoutEntityValidator.validate({
      buildParams: body,
      validationMode: ENTITY_VALIDATOR_VALIDATE_MODES.CREATE,
      userRole: ENTITY_VALIDATOR_VALIDATE_USER_ROLES.USER,
    });
    const { teacherId, packageId, lessonDuration, lessonLanguage } = validatedBody;
    const teacher = <JoinedUserDoc>await this._dbService.findById({
      _id: this._convertStringToObjectId(teacherId),
      dbServiceAccessOptions: { ...dbServiceAccessOptions, isReturningParent: true },
    });
    const teacherData = teacher.teacherData!;
    const teacherPackage = <PackageDoc>teacherData.packages.find((pkg) => {
      return pkg._id.equals(this._convertStringToObjectId(packageId));
    });
    const isTeacherApproved = teacherData.applicationStatus == 'approved';
    const isValidLessonDuration = teacherPackage.lessonDurations.includes(lessonDuration);
    const isValidLessonLanguage =
      teacherData.teachingLanguages.findIndex((teachingLanguage) => {
        return teachingLanguage.language == lessonLanguage;
      }) != -1;
    const isValidBody = isTeacherApproved && isValidLessonDuration && isValidLessonLanguage;

    if (!isValidBody) {
      throw new Error('Invalid body.');
    }
    return { teacher, teacherData, teacherPackage };
  };

  private _getPackageTransactionCheckoutResponse = async (
    props: GetRedirectUrlParams
  ): Promise<CreatePackageTransactionCheckoutUsecaseResponse> => {
    const { query } = props;
    const { paymentGateway } = query;
    const processedPaymentServiceParams = await this._getProcessedPaymentServiceParams(props);
    const { token } = processedPaymentServiceParams;
    let redirectUrl = '';
    switch (paymentGateway) {
      case PAYMENT_GATEWAY_NAME.PAYPAL:
        redirectUrl = await this._getPaypalRedirectUrl(processedPaymentServiceParams);
        break;
      case PAYMENT_GATEWAY_NAME.STRIPE:
        redirectUrl = await this._getStripeRedirectUrl(processedPaymentServiceParams);
        break;
      case PAYMENT_GATEWAY_NAME.PAYNOW:
        redirectUrl = await this._getPaynowRedirectUrl(processedPaymentServiceParams);
        break;
      default:
        throw new Error('Invalid payment handler query.');
    }
    const packageTransactionCheckoutUsecaseRes = { redirectUrl, token };
    return packageTransactionCheckoutUsecaseRes;
  };

  private _getProcessedPaymentServiceParams = async (props: GetRedirectUrlParams) => {
    const { body, currentAPIUser, teacher, teacherPackage } = props;
    const { userId } = currentAPIUser;
    const token = `${userId}-${DB_SERVICE_COLLECTIONS.PACKAGE_TRANSACTIONS}`;
    const processedPaymentServiceData = await this._getProcessedPaymentServiceData(props);
    const { item } = processedPaymentServiceData;
    await this._setTransactionJwt({
      body,
      teacherPackage,
      teacher,
      token,
      userId,
      processedPaymentServiceData,
    });
    const processedPaymentServiceParams = {
      item,
      successRedirectUrl: 'https://manabu.sg/dashboard',
      cancelRedirectUrl: 'https://manabu.sg/cancel',
      currency: this._defaultCurrency,
      token: token,
    };
    return processedPaymentServiceParams;
  };

  private _getProcessedPaymentServiceData = async (props: GetRedirectUrlParams) => {
    const { teacher, teacherData, teacherPackage, currentAPIUser, query, body } = props;
    const { lessonDuration, lessonLanguage } = body;
    const { paymentGateway } = query;
    const { hourlyRate, currency } = teacherData!.priceData;
    const subTotal = await this._exchangeRateHandler.multiply({
      multiplicand: {
        sourceCurrency: currency,
        amount: hourlyRate,
      },
      multiplier: {
        amount: (lessonDuration / 60) * teacherPackage.lessonAmount,
      },
      targetCurrency: this._defaultCurrency,
    });
    const total = await this._exchangeRateHandler.multiply({
      multiplicand: {
        amount: subTotal,
      },
      multiplier: {
        amount: 1 + PAYMENT_GATEWAY_RATE[paymentGateway],
      },
      targetCurrency: '',
    });
    const priceData = { currency: this._defaultCurrency, subTotal, total };
    const item = {
      id: `h-${teacher._id}-r-${currentAPIUser.userId}-${lessonLanguage}`,
      name: this._convertToTitlecase(
        `Minato Manabu - ${teacherPackage.packageName} / ${teacher.name}`
      ),
      price: total,
      quantity: 1,
    };
    const paymentData = {
      id: '',
      gateway: paymentGateway,
    };
    return { item, priceData, paymentData };
  };

  private _setTransactionJwt = async (
    setPackageTransactionJwtParams: SetPackageTransactionJwtParams
  ): Promise<void> => {
    const { token, processedPaymentServiceData, userId } = setPackageTransactionJwtParams;
    const packageTransactionEntityBuildParams = this._getPackageTransactionEntityBuildParams(
      setPackageTransactionJwtParams
    );
    const balanceTransactionEntityBuildParams = this._getBalanceTransactionEntityBuildParams({
      processedPaymentServiceData,
      userId: userId!,
    });
    const jwt = this._jwtHandler.sign({
      toTokenObj: { packageTransactionEntityBuildParams, balanceTransactionEntityBuildParams },
      expiresIn: '1d',
    });
    await this._cacheDbService.set({
      hashKey: CHECKOUT_TOKEN_HASH_KEY,
      key: token,
      value: jwt,
      ttlMs: TTL_MS.DAY,
    });
  };

  private _getPackageTransactionEntityBuildParams = (
    setPackageTransactionJwtParams: SetPackageTransactionJwtParams
  ): PackageTransactionEntityBuildParams => {
    const { body, userId, teacher, teacherPackage } = setPackageTransactionJwtParams;
    const { packageId, lessonLanguage, lessonDuration } = body;
    const { lessonAmount } = teacherPackage;
    const packageTransactionEntityBuildParams: PackageTransactionEntityBuildParams = {
      hostedById: teacher._id,
      reservedById: userId!,
      packageId,
      lessonDuration,
      lessonLanguage,
      remainingAppointments: lessonAmount,
      isSubscription: false,
    };
    return packageTransactionEntityBuildParams;
  };

  private _getBalanceTransactionEntityBuildParams = (props: {
    processedPaymentServiceData: ProcessedPaymentServiceData;
    userId: ObjectId;
  }): BalanceTransactionEntityBuildParams => {
    const { processedPaymentServiceData, userId } = props;
    const { priceData, paymentData } = processedPaymentServiceData;
    const { currency, subTotal, total } = priceData;
    const processingFee = total - subTotal;
    const balanceTransactionEntityBuildParams: BalanceTransactionEntityBuildParams = {
      userId,
      status: BALANCE_TRANSACTION_ENTITY_STATUS.COMPLETED,
      currency,
      type: BALANCE_TRANSACTION_ENTITY_TYPE.PACKAGE_TRANSACTION,
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
    return balanceTransactionEntityBuildParams;
  };

  private _getPaypalRedirectUrl = async (
    props: GetPaymentServiceRedirectUrlParams
  ): Promise<string> => {
    const { item, successRedirectUrl, cancelRedirectUrl, currency, token } = props;
    const { price, name, id, quantity } = item;
    const paymentHandlerExecuteParams: PaymentServiceExecuteParams = {
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
    const paypalCheckoutRes = await this._paypalPaymentService.executeSinglePayment(
      paymentHandlerExecuteParams
    );
    const { redirectUrl } = paypalCheckoutRes;
    return redirectUrl;
  };

  private _getStripeRedirectUrl = async (
    props: GetPaymentServiceRedirectUrlParams
  ): Promise<string> => {
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
    const paymentHandlerExecuteParams: PaymentServiceExecuteParams = {
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
    const stripeCheckoutRes = await this._stripePaymentService.executeSinglePayment(
      paymentHandlerExecuteParams
    );
    const { redirectUrl } = stripeCheckoutRes;
    return redirectUrl;
  };

  private _getPaynowRedirectUrl = async (
    props: GetPaymentServiceRedirectUrlParams
  ): Promise<string> => {
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
    const paymentHandlerExecuteParams: PaymentServiceExecuteParams = {
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
    const paynowCheckoutRes = await this._paynowPaymentService.executeSinglePayment(
      paymentHandlerExecuteParams
    );
    const { redirectUrl } = paynowCheckoutRes;
    return redirectUrl;
  };

  protected _initTemplate = async (
    optionalInitParams: OptionalCreatePackageTransactionCheckoutUsecaseInitParams
  ): Promise<void> => {
    const {
      makePaypalPaymentService,
      makeStripePaymentService,
      makePaynowPaymentService,
      makeExchangeRateHandler,
      makeJwtHandler,
      makeCacheDbService,
      makePackageTransactionCheckoutEntityValidator,
      convertStringToObjectId,
      convertToTitlecase,
    } = optionalInitParams;
    this._paypalPaymentService = await makePaypalPaymentService;
    this._stripePaymentService = await makeStripePaymentService;
    this._paynowPaymentService = await makePaynowPaymentService;
    this._exchangeRateHandler = await makeExchangeRateHandler;
    this._jwtHandler = await makeJwtHandler;
    this._cacheDbService = await makeCacheDbService;
    this._packageTransactionCheckoutEntityValidator = makePackageTransactionCheckoutEntityValidator;
    this._convertStringToObjectId = convertStringToObjectId;
    this._convertToTitlecase = convertToTitlecase;
  };
}

export {
  CreatePackageTransactionCheckoutUsecase,
  CreatePackageTransactionCheckoutUsecaseResponse,
  CHECKOUT_TOKEN_HASH_KEY,
};
