import { PackageDoc } from '../../../../../models/Package';
import { JoinedUserDoc } from '../../../../../models/User';
import { Await, StringKeyObject } from '../../../../../types/custom';
import { DbServiceAccessOptions } from '../../../../dataAccess/abstractions/IDbService';
import { TeacherDbServiceResponse } from '../../../../dataAccess/services/teacher/teacherDbService';
import { ConvertStringToObjectId } from '../../../../entities/utils/convertStringToObjectId';
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

type OptionalCreatePackageTransactionCheckoutUsecaseInitParams = {
  makePaypalPaymentHandler: Promise<PaypalPaymentHandler>;
  makeStripePaymentHandler: Promise<StripePaymentHandler>;
  makeExchangeRateHandler: Promise<ExchangeRateHandler>;
  makePackageTransactionCheckoutEntityValidator: PackageTransactionCheckoutEntityValidator;
  convertStringToObjectId: ConvertStringToObjectId;
  convertToTitlecase: ConvertToTitlecase;
};

type CreatePackageTransactionCheckoutUsecaseResponse = {
  redirectUrl: string;
};

type GetPaymentHandlerRedirectUrlParams = Await<
  ReturnType<CreatePackageTransactionCheckoutUsecase['_getProcessedPaymentHandlerParams']>
>;

type TestBodyResponse = {
  teacher: JoinedUserDoc;
  teacherData: JoinedUserDoc['teacherData'];
  teacherPackage: PackageDoc;
};

type GetRedirectUrlParams = MakeRequestTemplateParams & TestBodyResponse;

class CreatePackageTransactionCheckoutUsecase extends AbstractCreateUsecase<
  OptionalCreatePackageTransactionCheckoutUsecaseInitParams,
  CreatePackageTransactionCheckoutUsecaseResponse,
  TeacherDbServiceResponse
> {
  private _paypalPaymentHandler!: PaypalPaymentHandler;
  private _stripePaymentHandler!: StripePaymentHandler;
  private _exchangeRateHandler!: ExchangeRateHandler;
  private _packageTransactionCheckoutEntityValidator!: PackageTransactionCheckoutEntityValidator;
  private _convertStringToObjectId!: ConvertStringToObjectId;
  private _convertToTitlecase!: ConvertToTitlecase;

  protected _makeRequestTemplate = async (
    props: MakeRequestTemplateParams
  ): Promise<CreatePackageTransactionCheckoutUsecaseResponse> => {
    const { teacher, teacherData, teacherPackage } = await this._testBody(props);
    const redirectUrl = await this._getRedirectUrl({
      ...props,
      teacher,
      teacherData,
      teacherPackage,
    });
    const usecaseRes = {
      redirectUrl,
    };
    return usecaseRes;
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
    const { teacherId, packageId, lessonDuration, lessonLanguage, lessonAmount } = validatedBody;
    const teacher = <JoinedUserDoc>await this._dbService.findById({
      _id: this._convertStringToObjectId(teacherId),
      dbServiceAccessOptions: { ...dbServiceAccessOptions, isReturningParent: true },
    });
    const teacherData = teacher.teacherData!;
    const teacherPackage = <PackageDoc>teacherData.packages.find((pkg) => {
      return this._deepEqual(this._convertStringToObjectId(packageId), pkg._id);
    });
    const isTeacherApproved = teacherData.applicationStatus == 'approved';
    const isValidLessonDuration = teacherPackage.lessonDurations.includes(lessonDuration);
    const isValidLessonLanguage =
      teacherData.teachingLanguages.findIndex((teachingLanguage) => {
        return teachingLanguage.language == lessonLanguage;
      }) != -1;
    const isValidLessonAmount = teacherPackage.lessonAmount == lessonAmount;
    const isValidBody =
      isTeacherApproved && isValidLessonDuration && isValidLessonLanguage && isValidLessonAmount;

    if (!isValidBody) {
      throw new Error('Invalid body.');
    }
    return { teacher, teacherData, teacherPackage };
  };

  private _getRedirectUrl = async (props: GetRedirectUrlParams): Promise<string> => {
    const { query } = props;
    const { paymentGateway } = query;
    const processedPaymentHandlerParams = await this._getProcessedPaymentHandlerParams(props);
    let redirectUrl = '';
    switch (paymentGateway) {
      case 'paypal':
        redirectUrl = await this._getPaypalRedirectUrl(processedPaymentHandlerParams);
        break;
      case 'stripe':
        redirectUrl = await this._getStripeRedirectUrl(processedPaymentHandlerParams);
        break;
      case 'payNow':
        break;
      default:
        throw new Error('Invalid payment handler query.');
    }
    return redirectUrl;
  };

  private _getProcessedPaymentHandlerParams = async (props: GetRedirectUrlParams) => {
    const { teacher, teacherData, teacherPackage, currentAPIUser, query, body } = props;
    const { lessonDuration, lessonLanguage } = body;
    const { paymentGateway } = query;
    const DEFAULT_CURRENCY = 'SGD';
    const { hourlyRate, currency } = teacherData!.priceData;
    const paymentMethodRate: StringKeyObject = {
      paypal: 0.025,
      stripe: 0.01,
      paynow: 0.01,
    };
    const packageTransactionSubtotal =
      hourlyRate * (lessonDuration / 60) * teacherPackage.lessonAmount;
    const packageTransactionTotal =
      packageTransactionSubtotal * (1 + paymentMethodRate[paymentGateway]);
    const item = {
      id: `h-${teacher._id}-r-${currentAPIUser.userId}-${lessonLanguage}`,
      name: this._convertToTitlecase(
        `Minato Manabu - ${teacherPackage.packageName} / ${teacher.name}`
      ),
      price: await this._exchangeRateHandler.convert({
        amount: packageTransactionTotal,
        fromCurrency: currency,
        toCurrency: DEFAULT_CURRENCY,
      }),
      quantity: 1,
    };
    const processedPaymentHandlerParams = {
      item,
      successRedirectUrl: 'https://manabu.sg/success',
      cancelRedirectUrl: 'https://manabu.sg/cancel',
      currency: DEFAULT_CURRENCY,
    };
    return processedPaymentHandlerParams;
  };

  private _getPaypalRedirectUrl = async (
    props: GetPaymentHandlerRedirectUrlParams
  ): Promise<string> => {
    const { item, successRedirectUrl, cancelRedirectUrl, currency } = props;
    const price = item.price.toString();
    const paymentHandlerExecuteParams = {
      successRedirectUrl,
      cancelRedirectUrl,
      items: [
        {
          name: item.name,
          sku: item.id,
          price,
          currency,
          quantity: item.quantity,
        },
      ],
      currency,
      total: price,
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
    const { item, successRedirectUrl, cancelRedirectUrl, currency } = props;
    const price = item.price * 100;
    const paymentHandlerExecuteParams = {
      successRedirectUrl,
      cancelRedirectUrl,
      items: [
        {
          price_data: {
            currency: currency.toLowerCase(),
            product_data: {
              name: item.name,
            },
            unit_amount: 2000,
          },
          quantity: item.quantity,
        },
      ],
      currency,
      total: price,
    };
    const stripeCheckoutRes = await this._stripePaymentHandler.executeSinglePayment(
      paymentHandlerExecuteParams
    );
    const { redirectUrl } = stripeCheckoutRes;
    return redirectUrl;
  };

  protected _initTemplate = async (
    optionalInitParams: OptionalCreatePackageTransactionCheckoutUsecaseInitParams
  ): Promise<void> => {
    const {
      makePaypalPaymentHandler,
      makeStripePaymentHandler,
      makeExchangeRateHandler,
      makePackageTransactionCheckoutEntityValidator,
      convertStringToObjectId,
      convertToTitlecase,
    } = optionalInitParams;
    this._paypalPaymentHandler = await makePaypalPaymentHandler;
    this._stripePaymentHandler = await makeStripePaymentHandler;
    this._exchangeRateHandler = await makeExchangeRateHandler;
    this._packageTransactionCheckoutEntityValidator = makePackageTransactionCheckoutEntityValidator;
    this._convertStringToObjectId = convertStringToObjectId;
    this._convertToTitlecase = convertToTitlecase;
  };
}

export { CreatePackageTransactionCheckoutUsecase };
