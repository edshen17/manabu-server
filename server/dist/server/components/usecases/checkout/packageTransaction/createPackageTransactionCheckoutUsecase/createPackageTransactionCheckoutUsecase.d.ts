import { CacheDbService } from '../../../../dataAccess/services/cache/cacheDbService';
import { TeacherDbServiceResponse } from '../../../../dataAccess/services/teacher/teacherDbService';
import { ConvertStringToObjectId } from '../../../../entities/utils/convertStringToObjectId';
import { PaynowPaymentService } from '../../../../payment/services/paynow/paynowPaymentService';
import { PaypalPaymentService } from '../../../../payment/services/paypal/paypalPaymentService';
import { StripePaymentService } from '../../../../payment/services/stripe/stripePaymentService';
import { PackageTransactionCheckoutEntityValidator } from '../../../../validators/checkout/packageTransaction/entity/packageTransactionCheckoutEntityValidator';
import { AbstractCreateUsecase } from '../../../abstractions/AbstractCreateUsecase';
import { MakeRequestTemplateParams } from '../../../abstractions/AbstractUsecase';
import { ConvertToTitlecase } from '../../../utils/convertToTitlecase';
import { ExchangeRateHandler } from '../../../utils/exchangeRateHandler/exchangeRateHandler';
import { JwtHandler } from '../../../utils/jwtHandler/jwtHandler';
import { RedirectUrlBuilder } from '../../../utils/redirectUrlBuilder/redirectUrlBuilder';
declare type OptionalCreatePackageTransactionCheckoutUsecaseInitParams = {
    makePaypalPaymentService: Promise<PaypalPaymentService>;
    makeStripePaymentService: Promise<StripePaymentService>;
    makePaynowPaymentService: Promise<PaynowPaymentService>;
    makeExchangeRateHandler: Promise<ExchangeRateHandler>;
    makeJwtHandler: Promise<JwtHandler>;
    makeRedirectUrlBuilder: RedirectUrlBuilder;
    makeCacheDbService: Promise<CacheDbService>;
    makePackageTransactionCheckoutEntityValidator: PackageTransactionCheckoutEntityValidator;
    convertStringToObjectId: ConvertStringToObjectId;
    convertToTitlecase: ConvertToTitlecase;
};
declare type CreatePackageTransactionCheckoutUsecaseResponse = {
    redirectUrl: string;
    token: string;
};
declare type Timeslot = {
    startDate: Date;
    endDate: Date;
};
declare const CHECKOUT_TOKEN_HASH_KEY = "usercheckouttoken";
declare class CreatePackageTransactionCheckoutUsecase extends AbstractCreateUsecase<OptionalCreatePackageTransactionCheckoutUsecaseInitParams, CreatePackageTransactionCheckoutUsecaseResponse, TeacherDbServiceResponse> {
    private _paypalPaymentService;
    private _stripePaymentService;
    private _paynowPaymentService;
    private _exchangeRateHandler;
    private _cacheDbService;
    private _redirectUrlBuilder;
    private _jwtHandler;
    private _packageTransactionCheckoutEntityValidator;
    private _convertStringToObjectId;
    private _convertToTitlecase;
    protected _makeRequestTemplate: (props: MakeRequestTemplateParams) => Promise<CreatePackageTransactionCheckoutUsecaseResponse>;
    private _testBody;
    private _getPackageTransactionCheckoutResponse;
    private _getProcessedPaymentServiceParams;
    private _getProcessedPaymentServiceData;
    private _setTransactionJwt;
    private _createPackageTransactionEntityBuildParams;
    private _createDebitBalanceTransactionEntityBuildParams;
    private _getPaypalRedirectUrl;
    private _getStripeRedirectUrl;
    private _getPaynowRedirectUrl;
    protected _initTemplate: (optionalInitParams: OptionalCreatePackageTransactionCheckoutUsecaseInitParams) => Promise<void>;
}
export { CreatePackageTransactionCheckoutUsecase, CreatePackageTransactionCheckoutUsecaseResponse, CHECKOUT_TOKEN_HASH_KEY, Timeslot, };
