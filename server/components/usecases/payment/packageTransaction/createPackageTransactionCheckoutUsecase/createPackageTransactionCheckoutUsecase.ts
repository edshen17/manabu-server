// import { ObjectId } from 'mongoose';
// import { PaypalHandler } from '../../../../paymentHandlers/paypal/paypalHandler';
// import { StripeHandler } from '../../../../paymentHandlers/stripe/stripeHandler';
// import { AbstractCreateUsecase } from '../../../abstractions/AbstractCreateUsecase';
// import { MakeRequestTemplateParams } from '../../../abstractions/AbstractUsecase';

// type OptionalCreatePackageTransactionCheckoutUsecaseInitParams = {
//   makePaypalHandler: PaypalHandler;
//   makeStripeHandler: StripeHandler;
// };

// type CreateAvailableTimeUsecaseResponse = {
//   redirectUrl: string;
// };

// class CreatePackageTransactionCheckoutUsecase extends AbstractCreateUsecase<
//   OptionalCreatePackageTransactionCheckoutUsecaseInitParams,
//   CreateAvailableTimeUsecaseResponse,
//   undefined
// > {
//   private _paypalHandler!: PaypalHandler;
//   private _stripeHandler!: StripeHandler;

//   protected _makeRequestTemplate = async (
//     props: MakeRequestTemplateParams
//   ): Promise<CreateAvailableTimeUsecaseResponse> => {
//     const { body, dbServiceAccessOptions, currentAPIUser } = props;
//     await this._testTimeConflict(body);
//     const availableTimeEntity = await this._availableTimeEntity.build({
//       ...body,
//       hostedById: <ObjectId>currentAPIUser.userId,
//     });
//     const availableTime = await this._createAvailableTime({
//       availableTimeEntity,
//       dbServiceAccessOptions,
//     });
//     const usecaseRes = {
//       availableTime,
//     };
//     return usecaseRes;
//   };

//   protected _initTemplate = async (
//     optionalInitParams: OptionalCreatePackageTransactionCheckoutUsecaseInitParams
//   ): Promise<void> => {
//     const { makePaypalHandler, makeStripeHandler } = optionalInitParams;
//     this._ = await makeAvailableTimeEntity;
//     this._availableTimeConflictHandler = await makeAvailableTimeConflictHandler;
//   };
// }

// export { CreatePackageTransactionCheckoutUsecase };
