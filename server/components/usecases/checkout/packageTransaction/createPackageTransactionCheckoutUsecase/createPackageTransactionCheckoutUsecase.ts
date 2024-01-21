import { ObjectId } from 'mongoose';
import {
  DEFAULT_CURRENCY,
  PACKAGE_DISCOUNT_RATE,
  PAYMENT_GATEWAY_FEE,
} from '../../../../../constants';
import { PackageDoc } from '../../../../../models/Package';
import { JoinedUserDoc } from '../../../../../models/User';
import { Await, StringKeyObject } from '../../../../../types/custom';
import {
  DB_SERVICE_COLLECTION,
  DbServiceAccessOptions,
} from '../../../../dataAccess/abstractions/IDbService';
import { CacheDbService, TTL_MS } from '../../../../dataAccess/services/cache/cacheDbService';
import { TeacherDbServiceResponse } from '../../../../dataAccess/services/teacher/teacherDbService';
import {
  BALANCE_TRANSACTION_ENTITY_STATUS,
  BALANCE_TRANSACTION_ENTITY_TYPE,
  BalanceTransactionEntityBuildParams,
} from '../../../../entities/balanceTransaction/balanceTransactionEntity';
import { PackageTransactionEntityBuildParams } from '../../../../entities/packageTransaction/packageTransactionEntity';
import { ConvertStringToObjectId } from '../../../../entities/utils/convertStringToObjectId';
import {
  PAYMENT_GATEWAY_NAME,
  PAYMENT_TYPE,
  PaymentServiceExecutePaymentParams,
} from '../../../../payment/abstractions/IPaymentService';
import { PaynowPaymentService } from '../../../../payment/services/paynow/paynowPaymentService';
import { PaypalPaymentService } from '../../../../payment/services/paypal/paypalPaymentService';
import { StripePaymentService } from '../../../../payment/services/stripe/stripePaymentService';
import {
  ENTITY_VALIDATOR_VALIDATE_MODE,
  ENTITY_VALIDATOR_VALIDATE_USER_ROLE,
} from '../../../../validators/abstractions/AbstractEntityValidator';
import { PackageTransactionCheckoutEntityValidator } from '../../../../validators/checkout/packageTransaction/entity/packageTransactionCheckoutEntityValidator';
import { AbstractCreateUsecase } from '../../../abstractions/AbstractCreateUsecase';
import { MakeRequestTemplateParams } from '../../../abstractions/AbstractUsecase';
import { ConvertToTitlecase } from '../../../utils/convertToTitlecase';
import { ExchangeRateHandler } from '../../../utils/exchangeRateHandler/exchangeRateHandler';
import { JwtHandler } from '../../../utils/jwtHandler/jwtHandler';
import { RedirectUrlBuilder } from '../../../utils/redirectUrlBuilder/redirectUrlBuilder';

type OptionalCreatePackageTransactionCheckoutUsecaseInitParams = {
  makePaypalPaymentService: Promise<PaypalPaymentService>;
  makeStripePaymentService: Promise<StripePaymentService>;
  makePaynowPaymentService: Promise<PaynowPaymentService>;
  makeExchangeRateHandler: Promise<ExchangeRateHandler>;
  makeJwtHandler: Promise<JwtHandler>;
  makeRedirectUrlBuilder: RedirectUrlBuilder;
  makeCacheDbService: Promise<CacheDbService>;
  makePackageTransactionCheckoutEntityValidator: PackageTransactionCheckoutEntityValidator;
  currency: any;
  convertStringToObjectId: ConvertStringToObjectId;
  convertToTitlecase: ConvertToTitlecase;
};

type CreatePackageTransactionCheckoutUsecaseResponse = {
  redirectUrl: string;
  token: string;
};

type GetRedirectUrlParams = MakeRequestTemplateParams & TestBodyResponse;

type Timeslot = { startDate: Date; endDate: Date };

type TestBodyResponse = {
  teacher: JoinedUserDoc;
  teacherData: JoinedUserDoc['teacherData'];
  teacherPackage: PackageDoc;
  timeslots: Timeslot[];
  type: PAYMENT_TYPE;
};

type GetPaymentServiceRedirectUrlParams = Await<
  ReturnType<CreatePackageTransactionCheckoutUsecase['_getProcessedPaymentServiceParams']>
>;

type SetPackageTransactionJwtParams = {
  teacherPackage: PackageDoc;
  body: StringKeyObject;
  userId?: ObjectId;
  token: string;
  type: PAYMENT_TYPE;
  teacher: JoinedUserDoc;
  processedPaymentServiceData: ProcessedPaymentServiceData;
  timeslots: Timeslot[];
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
  private _redirectUrlBuilder!: RedirectUrlBuilder;
  private _jwtHandler!: JwtHandler;
  private _packageTransactionCheckoutEntityValidator!: PackageTransactionCheckoutEntityValidator;
  private _convertStringToObjectId!: ConvertStringToObjectId;
  private _convertToTitlecase!: ConvertToTitlecase;
  private _currency!: any;

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

  private _testBody = async ({
    body,
    dbServiceAccessOptions,
  }: {
    body: StringKeyObject;
    dbServiceAccessOptions: DbServiceAccessOptions;
  }): Promise<TestBodyResponse> => {
    const validatedBody = this._packageTransactionCheckoutEntityValidator.validate({
      buildParams: body,
      validationMode: ENTITY_VALIDATOR_VALIDATE_MODE.CREATE,
      userRole: ENTITY_VALIDATOR_VALIDATE_USER_ROLE.USER,
    });
    const { teacherId, packageId, lessonDuration, lessonLanguage, timeslots, type } = validatedBody;
    const teacher = <JoinedUserDoc>await this._dbService.findById({
      _id: this._convertStringToObjectId(teacherId),
      dbServiceAccessOptions: { ...dbServiceAccessOptions, isReturningParent: true },
    });
    const teacherData = teacher.teacherData!;
    const teacherPackage = <PackageDoc>teacherData.packages.find((pkg) => {
      return pkg._id.equals(this._convertStringToObjectId(packageId));
    });
    const isTeacherApproved = true;
    const isValidLessonDuration = teacherPackage.lessonDurations.includes(lessonDuration);
    const isValidLessonLanguage =
      teacherData.teachingLanguages.findIndex((teachingLanguage) => {
        return teachingLanguage.code == lessonLanguage;
      }) != -1;
    const isValidBody = isTeacherApproved && isValidLessonDuration && isValidLessonLanguage;
    if (!isValidBody) {
      throw new Error('Invalid body.');
    }
    return { teacher, teacherData, teacherPackage, timeslots, type };
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
    const { body, currentAPIUser, teacher, teacherPackage, timeslots, type } = props;
    const { userId } = currentAPIUser;
    const token = `${userId}-${DB_SERVICE_COLLECTION.PACKAGE_TRANSACTIONS}`;
    const processedPaymentServiceData = await this._getProcessedPaymentServiceData(props);
    const { item } = processedPaymentServiceData;
    await this._setTransactionJwt({
      body,
      teacherPackage,
      teacher,
      token,
      userId,
      timeslots,
      type,
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
      currency: DEFAULT_CURRENCY,
      token: token,
      type,
    };
    return processedPaymentServiceParams;
  };

  private _getProcessedPaymentServiceData = async (props: GetRedirectUrlParams) => {
    const { teacher, teacherData, teacherPackage, currentAPIUser, query, body } = props;
    const { lessonDuration, lessonLanguage } = body;
    const { paymentGateway } = query;
    const { hourlyRate, currency } = teacherData!.priceData;
    const lessonAmount = teacherPackage.lessonAmount;
    const subTotal = await this._exchangeRateHandler.multiply({
      multiplicand: {
        sourceCurrency: currency,
        amount: hourlyRate,
      },
      multiplier: {
        amount: (lessonDuration / 60) * lessonAmount * (1 - PACKAGE_DISCOUNT_RATE(lessonAmount)),
      },
      targetCurrency: DEFAULT_CURRENCY,
    });
    const total = subTotal + PAYMENT_GATEWAY_FEE[paymentGateway.toUpperCase()](subTotal);
    const priceData = { currency: DEFAULT_CURRENCY, subTotal, total };
    const item = {
      id: `teacher-${teacher._id}-student-${currentAPIUser.userId}-${lessonLanguage}`,
      name: this._convertToTitlecase(`Minato Manabu - ${teacherPackage.name} / ${teacher.name}`),
      price: this._currency(total).value,
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
    const { token, processedPaymentServiceData, userId, timeslots, type } =
      setPackageTransactionJwtParams;
    const packageTransactionEntityBuildParams = this._createPackageTransactionEntityBuildParams(
      setPackageTransactionJwtParams
    );
    const debitBalanceTransactionEntityBuildParams =
      this._createDebitBalanceTransactionEntityBuildParams({
        processedPaymentServiceData,
        userId: userId!,
      });
    const jwt = this._jwtHandler.sign({
      toTokenObj: {
        packageTransactionEntityBuildParams,
        balanceTransactionEntityBuildParams: debitBalanceTransactionEntityBuildParams,
        timeslots,
        type,
      },
      expiresIn: '1d',
    });
    await this._cacheDbService.set({
      hashKey: CHECKOUT_TOKEN_HASH_KEY,
      key: token,
      value: jwt,
      ttlMs: TTL_MS.DAY,
    });
  };

  private _createPackageTransactionEntityBuildParams = (
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

  private _createDebitBalanceTransactionEntityBuildParams = (props: {
    processedPaymentServiceData: ProcessedPaymentServiceData;
    userId: ObjectId;
  }): BalanceTransactionEntityBuildParams => {
    const { processedPaymentServiceData, userId } = props;
    const { priceData, paymentData } = processedPaymentServiceData;
    const { currency, subTotal, total } = priceData;
    const processingFee = total - subTotal;
    const debitBalanceTransactionEntityBuildParams: BalanceTransactionEntityBuildParams = {
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
    return debitBalanceTransactionEntityBuildParams;
  };

  private _getPaypalRedirectUrl = async ({
    item,
    successRedirectUrl,
    cancelRedirectUrl,
    currency,
    token,
    type,
  }: GetPaymentServiceRedirectUrlParams): Promise<string> => {
    const { price, name, id, quantity } = item;
    const paymentHandlerExecuteParams: PaymentServiceExecutePaymentParams = {
      successRedirectUrl,
      cancelRedirectUrl,
      type,
      items: [
        {
          name: name,
          sku: id,
          price: price.toString(),
          currency,
          quantity,
        },
      ],
      currency,
      total: price,
      token,
    };
    const paypalCheckoutRes = await this._paypalPaymentService.executePayment(
      paymentHandlerExecuteParams
    );
    const { redirectUrl } = paypalCheckoutRes;
    return redirectUrl;
  };

  private _getStripeRedirectUrl = async (
    props: GetPaymentServiceRedirectUrlParams
  ): Promise<string> => {
    const { item, successRedirectUrl, cancelRedirectUrl, currency, token, type } = props;
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
    const paymentHandlerExecuteParams: PaymentServiceExecutePaymentParams = {
      successRedirectUrl,
      cancelRedirectUrl,
      type,
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
    const stripeCheckoutRes = await this._stripePaymentService.executePayment(
      paymentHandlerExecuteParams
    );
    const { redirectUrl } = stripeCheckoutRes;
    return redirectUrl;
  };

  private _getPaynowRedirectUrl = async ({
    item,
    successRedirectUrl,
    cancelRedirectUrl,
    currency,
    token,
    type,
  }: GetPaymentServiceRedirectUrlParams): Promise<string> => {
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
    const paymentHandlerExecuteParams: PaymentServiceExecutePaymentParams = {
      successRedirectUrl,
      cancelRedirectUrl,
      type,
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
    const paynowCheckoutRes = await this._paynowPaymentService.executePayment(
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
      makeRedirectUrlBuilder,
      currency,
      convertStringToObjectId,
      convertToTitlecase,
    } = optionalInitParams;
    this._paypalPaymentService = await makePaypalPaymentService;
    this._stripePaymentService = await makeStripePaymentService;
    this._paynowPaymentService = await makePaynowPaymentService;
    this._exchangeRateHandler = await makeExchangeRateHandler;
    this._jwtHandler = await makeJwtHandler;
    this._redirectUrlBuilder = makeRedirectUrlBuilder;
    this._cacheDbService = await makeCacheDbService;
    this._packageTransactionCheckoutEntityValidator = makePackageTransactionCheckoutEntityValidator;
    this._currency = currency;
    this._convertStringToObjectId = convertStringToObjectId;
    this._convertToTitlecase = convertToTitlecase;
  };
}

export {
  CHECKOUT_TOKEN_HASH_KEY,
  CreatePackageTransactionCheckoutUsecase,
  CreatePackageTransactionCheckoutUsecaseResponse,
  Timeslot,
};
