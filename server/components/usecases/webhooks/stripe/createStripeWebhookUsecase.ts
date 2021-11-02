// import Stripe from 'stripe';
// import { PackageTransactionDoc } from '../../../../models/PackageTransaction';
// import { StringKeyObject } from '../../../../types/custom';
// import { DB_SERVICE_COLLECTIONS } from '../../../dataAccess/abstractions/IDbService';
// import { PackageTransactionDbServiceResponse } from '../../../dataAccess/services/packageTransaction/packageTransactionDbService';
// import { AbstractCreateUsecase } from '../../abstractions/AbstractCreateUsecase';
// import { MakeRequestTemplateParams } from '../../abstractions/AbstractUsecase';
// import { CreatePackageTransactionUsecase } from '../../packageTransaction/createPackageTransactionUsecase/createPackageTransactionUsecase';

// //paypal, paynow, stripe in query..., should call createpackagetransaction usecase and make package transaction for user...
// // get token from response, then check jwt. if resourceName == packageTransaction, create

// type OptionalCreatePackageTransactionWebhookUsecaseInitParams = {
//   makeCreatePackageTransactionUsecase: Promise<CreatePackageTransactionUsecase>;
//   stripe: Stripe;
// };

// type CreatePackageTransactionWebhookUsecaseResponse = {
//   packageTransaction?: PackageTransactionDoc;
// };

// class CreatePackageTransactionWebhookUsecase extends AbstractCreateUsecase<
//   OptionalCreatePackageTransactionWebhookUsecaseInitParams,
//   CreatePackageTransactionWebhookUsecaseResponse,
//   PackageTransactionDbServiceResponse
// > {
//   private _createPackageTransactionUsecase!: CreatePackageTransactionUsecase;
//   private _stripe!: Stripe;

//   protected _makeRequestTemplate = async (
//     props: MakeRequestTemplateParams
//   ): Promise<CreatePackageTransactionWebhookUsecaseResponse> => {
//     const { body, dbServiceAccessOptions, currentAPIUser, headers } = props;
//     const stripeEvent = this._getStripeEvent({ body, headers });
//     const stripeEventType = stripeEvent.type;
//     const userToken = (stripeEvent as StringKeyObject).data.object.charges.data[0].metadata.token;
//     const resourceName = userToken.split('-')[1];
//     let usecaseRes: CreatePackageTransactionWebhookUsecaseResponse = {};
//     switch (stripeEventType) {
//       case 'payment_intent.succeeded':
//         usecaseRes = await this._createResourceBrancher(resourceName);
//         break;
//       default:
//         break;
//     }
//     return usecaseRes;
//   };

//   private _getStripeEvent = (props: { body: any; headers: StringKeyObject }): Stripe.Event => {
//     const { headers, body } = props;
//     const sig = headers['stripe-signature'];
//     let webhookSecret = process.env.STRIPE_WEBHOOK_SECREY_KEY_DEV!;
//     if (process.env.NODE_ENV == 'production') {
//       webhookSecret = process.env.STRIPE_WEBHOOK_SECREY_KEY!;
//     }
//     const event = this._stripe.webhooks.constructEvent(body, sig, webhookSecret);
//     return event;
//   };

//   private _createResourceBrancher = async (
//     resourceName: string
//   ): Promise<CreatePackageTransactionWebhookUsecaseResponse> => {
//     switch (resourceName) {
//       case DB_SERVICE_COLLECTIONS.PACKAGE_TRANSACTIONS:
//         break;
//       default:
//         break;
//     }
//     return {};
//   };

//   protected _initTemplate = async (
//     optionalInitParams: OptionalCreatePackageTransactionWebhookUsecaseInitParams
//   ): Promise<void> => {
//     const { makeCreatePackageTransactionUsecase, stripe } = optionalInitParams;
//     this._createPackageTransactionUsecase = await makeCreatePackageTransactionUsecase;
//     this._stripe = stripe;
//   };
// }

// export { CreatePackageTransactionWebhookUsecase, CreatePackageTransactionWebhookUsecaseResponse };
