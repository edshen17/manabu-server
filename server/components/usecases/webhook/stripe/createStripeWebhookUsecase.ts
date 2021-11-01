import Stripe from 'stripe';
import { PackageTransactionDoc } from '../../../../models/PackageTransaction';
import { StringKeyObject } from '../../../../types/custom';
import { PackageTransactionDbServiceResponse } from '../../../dataAccess/services/packageTransaction/packageTransactionDbService';
import { AbstractCreateUsecase } from '../../abstractions/AbstractCreateUsecase';
import { MakeRequestTemplateParams } from '../../abstractions/AbstractUsecase';
import { CreatePackageTransactionUsecase } from '../../packageTransaction/createPackageTransactionUsecase/createPackageTransactionUsecase';

//paypal, paynow, stripe in query..., should call createpackagetransaction usecase and make package transaction for user...
// get token from response, then check jwt. if resourceName == packageTransaction, create

type OptionalCreatePackageTransactionWebhookUsecaseInitParams = {
  makeCreatePackageTransactionUsecase: Promise<CreatePackageTransactionUsecase>;
  stripe: Stripe;
};

type CreatePackageTransactionWebhookUsecaseResponse = {
  packageTransaction?: PackageTransactionDoc;
};

class CreatePackageTransactionWebhookUsecase extends AbstractCreateUsecase<
  OptionalCreatePackageTransactionWebhookUsecaseInitParams,
  CreatePackageTransactionWebhookUsecaseResponse,
  PackageTransactionDbServiceResponse
> {
  private _createPackageTransactionUsecase!: CreatePackageTransactionUsecase;
  private _stripe!: Stripe;

  protected _makeRequestTemplate = async (
    props: MakeRequestTemplateParams
  ): Promise<CreatePackageTransactionWebhookUsecaseResponse> => {
    const { body, dbServiceAccessOptions, currentAPIUser, headers } = props;
    let data;
    let eventType;
    // change to dev secret if not production
    const webhookSecret = 'whsec_CB0N6A02vhjNDHLqJBaQFhJfMENy6nkG';

    if (webhookSecret) {
      // Retrieve the event by verifying the signature using the raw body and secret.
      let event: StringKeyObject;
      const signature = headers['stripe-signature'];

      try {
        event = this._stripe.webhooks.constructEvent(body, signature!, webhookSecret);
      } catch (err) {
        console.log(`⚠️  Webhook signature verification failed.`);
      }
      // Extract the object from the event.
      data = event!.data;
      eventType = event!.type;
    }

    switch (eventType) {
      case 'payment_intent.succeeded':
        // create package transaction if meta data is package transaction, createPackageusecase
        break;
      case 'invoice.paid':
        break;
      case 'invoice.payment_failed':
        break;
      default:
      // Unhandled event type
    }
    const packageTransaction = null;
    const usecaseRes = {
      packageTransaction,
    };
    return usecaseRes;
  };

  protected _initTemplate = async (
    optionalInitParams: OptionalCreatePackageTransactionWebhookUsecaseInitParams
  ): Promise<void> => {
    const { makeCreatePackageTransactionUsecase, stripe } = optionalInitParams;
    this._createPackageTransactionUsecase = await makeCreatePackageTransactionUsecase;
    this._stripe = stripe;
  };
}

export { CreatePackageTransactionWebhookUsecase, CreatePackageTransactionWebhookUsecaseResponse };
