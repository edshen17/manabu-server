import { createSchema, Type, typedModel, ExtractDoc } from 'ts-mongoose';
import { UserSchema } from './User';
import { PackageDoc, PackageSchema } from './Package';
import { JoinedUserDoc } from '../components/dataAccess/services/user/userDbService';

const PackageTransactionSchema = createSchema({
  hostedById: Type.ref(Type.objectId({ required: true, index: true })).to('User', UserSchema),
  reservedById: Type.ref(Type.objectId({ required: true, index: true })).to('User', UserSchema),
  packageId: Type.ref(Type.objectId({ required: true, index: true })).to('Package', PackageSchema),
  transactionDate: Type.date({ default: Date.now }),
  lessonDuration: Type.number({ required: true }),
  priceData: Type.object({ required: true }).of({
    currency: Type.string(),
    subTotal: Type.number(),
    total: Type.number(),
  }),
  terminationDate: Type.date({ required: true }),
  isTerminated: Type.boolean({ required: true }),
  remainingAppointments: Type.number({ required: true }),
  remainingReschedules: Type.number({ required: true }),
  lessonLanguage: Type.string({ required: true }),
  isSubscription: Type.boolean({ required: true }),
  paymentData: Type.object({ required: false }).of({
    gatewayName: Type.string(),
    gatewayTransactionId: Type.string(),
  }),
  packageData: Type.object({ required: true }).of({}),
  hostedByData: Type.object({ required: true }).of({}),
  reservedByData: Type.object({ required: true }).of({}),
});

const PackageTransaction = typedModel('PackageTransaction', PackageTransactionSchema);
type PackageTransactionDoc = ExtractDoc<typeof PackageTransactionSchema> & {
  packageData: PackageDoc;
  hostedByData: JoinedUserDoc;
  reservedByData: JoinedUserDoc;
};

export { PackageTransaction, PackageTransactionSchema, PackageTransactionDoc };
