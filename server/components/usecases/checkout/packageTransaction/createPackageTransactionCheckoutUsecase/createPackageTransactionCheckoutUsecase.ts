import { ObjectId } from 'mongoose';
import { PackageDoc } from '../../../../../models/Package';
import { JoinedUserDoc } from '../../../../../models/User';
import { Await, StringKeyObject } from '../../../../../types/custom';
import {
  DbServiceAccessOptions,
  DB_SERVICE_COLLECTIONS,
} from '../../../../dataAccess/abstractions/IDbService';
import { CacheDbService, TTL_MS } from '../../../../dataAccess/services/cache/cacheDbService';
import { TeacherDbServiceResponse } from '../../../../dataAccess/services/teacher/teacherDbService';
import { PackageTransactionEntityBuildParams } from '../../../../entities/packageTransaction/packageTransactionEntity';
import { ConvertStringToObjectId } from '../../../../entities/utils/convertStringToObjectId';
import {
  PaymentHandlerExecuteParams,
  PAYMENT_GATEWAY_NAME,
} from '../../../../paymentHandlers/abstractions/IPaymentHandler';
import { PaynowPaymentHandler } from '../../../../paymentHandlers/paynow/paynowPaymentHandler';
import { PaypalPaymentHandler } from '../../../../paymentHandlers/paypal/paypalPaymentHandler';
import { StripePaymentHandler } from '../../../../paymentHandlers/stripe/stripePaymentHandler';
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
  makePaypalPaymentHandler: Promise<PaypalPaymentHandler>;
  makeStripePaymentHandler: Promise<StripePaymentHandler>;
  makePaynowPaymentHandler: Promise<PaynowPaymentHandler>;
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

type GetPaymentHandlerRedirectUrlParams = Await<
  ReturnType<CreatePackageTransactionCheckoutUsecase['_getProcessedPaymentHandlerParams']>
>;

type SetPackageTransactionJwtParams = {
  teacherPackage: PackageDoc;
  body: StringKeyObject;
  userId?: ObjectId;
  token: string;
  teacher: JoinedUserDoc;
  processedPaymentHandlerData: Await<
    ReturnType<CreatePackageTransactionCheckoutUsecase['_getProcessedPaymentHandlerData']>
  >;
};

const CHECKOUT_TOKEN_HASH_KEY = 'usercheckouttoken';

class CreatePackageTransactionCheckoutUsecase extends AbstractCreateUsecase<
  OptionalCreatePackageTransactionCheckoutUsecaseInitParams,
  CreatePackageTransactionCheckoutUsecaseResponse,
  TeacherDbServiceResponse
> {
  private _paypalPaymentHandler!: PaypalPaymentHandler;
  private _stripePaymentHandler!: StripePaymentHandler;
  private _paynowPaymentHandler!: PaynowPaymentHandler;
  private _exchangeRateHandler!: ExchangeRateHandler;
  private _cacheDbService!: CacheDbService;
  private _jwtHandler!: JwtHandler;
  private _packageTransactionCheckoutEntityValidator!: PackageTransactionCheckoutEntityValidator;
  private _convertStringToObjectId!: ConvertStringToObjectId;
  private _convertToTitlecase!: ConvertToTitlecase;
  private _defaultCurrency: string = process.env.DEFAULT_CURRENCY!;

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
    const processedPaymentHandlerParams = await this._getProcessedPaymentHandlerParams(props);
    const { token } = processedPaymentHandlerParams;
    let redirectUrl = '';
    switch (paymentGateway) {
      case PAYMENT_GATEWAY_NAME.PAYPAL:
        redirectUrl = await this._getPaypalRedirectUrl(processedPaymentHandlerParams);
        break;
      case PAYMENT_GATEWAY_NAME.STRIPE:
        redirectUrl = await this._getStripeRedirectUrl(processedPaymentHandlerParams);
        break;
      case PAYMENT_GATEWAY_NAME.PAYNOW:
        redirectUrl = await this._getPaynowRedirectUrl(processedPaymentHandlerParams);
        break;
      default:
        throw new Error('Invalid payment handler query.');
    }
    const packageTransactionCheckoutUsecaseRes = { redirectUrl, token };
    return packageTransactionCheckoutUsecaseRes;
  };

  private _getProcessedPaymentHandlerParams = async (props: GetRedirectUrlParams) => {
    const { body, currentAPIUser, teacher, teacherPackage } = props;
    const { userId } = currentAPIUser;
    const token = `${userId}-${DB_SERVICE_COLLECTIONS.PACKAGE_TRANSACTIONS}`;
    const processedPaymentHandlerData = await this._getProcessedPaymentHandlerData(props);
    const { item } = processedPaymentHandlerData;
    await this._setPackageTransactionJwt({
      body,
      teacherPackage,
      teacher,
      token,
      userId,
      processedPaymentHandlerData,
    });
    const processedPaymentHandlerParams = {
      item,
      successRedirectUrl: 'https://manabu.sg/dashboard',
      cancelRedirectUrl: 'https://manabu.sg/cancel',
      currency: this._defaultCurrency,
      token: token,
    };
    return processedPaymentHandlerParams;
  };

  private _getProcessedPaymentHandlerData = async (props: GetRedirectUrlParams) => {
    const { teacher, teacherData, teacherPackage, currentAPIUser, query, body } = props;
    const { lessonDuration, lessonLanguage } = body;
    const { paymentGateway } = query;
    const { hourlyRate, currency } = teacherData!.priceData;
    const PAYMENT_GATEWAY_RATE: StringKeyObject = {
      paypal: 0.03,
      stripe: 0.01,
      paynow: 0.01,
    };
    const subTotal = hourlyRate * (lessonDuration / 60) * teacherPackage.lessonAmount;
    const total = subTotal * (1 + PAYMENT_GATEWAY_RATE[paymentGateway]);
    const priceData = { currency, subTotal, total };
    const item = {
      id: `h-${teacher._id}-r-${currentAPIUser.userId}-${lessonLanguage}`,
      name: this._convertToTitlecase(
        `Minato Manabu - ${teacherPackage.packageName} / ${teacher.name}`
      ),
      price: await this._exchangeRateHandler.convert({
        amount: priceData.total,
        fromCurrency: currency,
        toCurrency: this._defaultCurrency,
      }),
      quantity: 1,
    };
    const paymentData = {
      id: '',
      gateway: paymentGateway,
    };
    return { item, priceData, paymentData };
  };

  private _setPackageTransactionJwt = async (
    setPackageTransactionJwtParams: SetPackageTransactionJwtParams
  ): Promise<void> => {
    const { token } = setPackageTransactionJwtParams;
    const packageTransactionEntityBuildParams = this._getPackageTransactionEntityBuildParams(
      setPackageTransactionJwtParams
    );
    const jwt = this._jwtHandler.sign({
      toTokenObj: { packageTransactionEntityBuildParams },
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
  ) => {
    const { body, userId, teacher, processedPaymentHandlerData, teacherPackage } =
      setPackageTransactionJwtParams;
    const { packageId, lessonLanguage, lessonDuration } = body;
    const { priceData, paymentData } = processedPaymentHandlerData;
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
    //create balance transaction entity?
    return packageTransactionEntityBuildParams;
  };

  private _getPaypalRedirectUrl = async (
    props: GetPaymentHandlerRedirectUrlParams
  ): Promise<string> => {
    const { item, successRedirectUrl, cancelRedirectUrl, currency, token } = props;
    const { price, name, id, quantity } = item;
    const paymentHandlerExecuteParams: PaymentHandlerExecuteParams = {
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
    const paypalCheckoutRes = await this._paypalPaymentHandler.executeSinglePayment(
      paymentHandlerExecuteParams
    );
    const { redirectUrl } = paypalCheckoutRes;
    return redirectUrl;
  };

  private _getStripeRedirectUrl = async (
    props: GetPaymentHandlerRedirectUrlParams
  ): Promise<string> => {
    const { item, successRedirectUrl, cancelRedirectUrl, currency, token } = props;
    const { price, name, quantity } = item;
    const stripePrice = price * 100;
    const paymentHandlerExecuteParams: PaymentHandlerExecuteParams = {
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
    const stripeCheckoutRes = await this._stripePaymentHandler.executeSinglePayment(
      paymentHandlerExecuteParams
    );
    const { redirectUrl } = stripeCheckoutRes;
    return redirectUrl;
  };

  private _getPaynowRedirectUrl = async (
    props: GetPaymentHandlerRedirectUrlParams
  ): Promise<string> => {
    const { item, successRedirectUrl, cancelRedirectUrl, currency, token } = props;
    const { price, name } = item;
    const paynowPrice = price * 100;
    const paymentHandlerExecuteParams: PaymentHandlerExecuteParams = {
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
    const paynowCheckoutRes = await this._paynowPaymentHandler.executeSinglePayment(
      paymentHandlerExecuteParams
    );
    const { redirectUrl } = paynowCheckoutRes;
    return redirectUrl;
  };

  protected _initTemplate = async (
    optionalInitParams: OptionalCreatePackageTransactionCheckoutUsecaseInitParams
  ): Promise<void> => {
    const {
      makePaypalPaymentHandler,
      makeStripePaymentHandler,
      makePaynowPaymentHandler,
      makeExchangeRateHandler,
      makeJwtHandler,
      makeCacheDbService,
      makePackageTransactionCheckoutEntityValidator,
      convertStringToObjectId,
      convertToTitlecase,
    } = optionalInitParams;
    this._paypalPaymentHandler = await makePaypalPaymentHandler;
    this._stripePaymentHandler = await makeStripePaymentHandler;
    this._paynowPaymentHandler = await makePaynowPaymentHandler;
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
