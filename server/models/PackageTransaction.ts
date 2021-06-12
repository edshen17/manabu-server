import { createSchema, Type, typedModel, ExtractDoc } from 'ts-mongoose';
import { UserSchema } from './User';
import { PackageSchema } from './Package';

const PackageTransactionSchema = createSchema({
  hostedBy: Type.ref(Type.objectId({ required: true, index: true })).to('User', UserSchema),
  reservedBy: Type.ref(Type.objectId({ required: true, index: true })).to('User', UserSchema),
  packageId: Type.ref(Type.objectId({ required: true, index: true })).to('Package', PackageSchema),
  transactionDate: Type.date({ default: Date.now }),
  reservationLength: Type.number({ required: true }),
  transactionDetails: Type.object({ required: true }).of({
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
  paymentMethodData: Type.object({ required: false }).of({
    method: Type.string(),
    paymentId: Type.string(),
  }),
  packageData: Type.object({ required: true }).of({}),
  hostedByData: Type.object({ required: true }).of({}),
  reservedByData: Type.object({ required: true }).of({}),
});

const PackageTransaction = typedModel('PackageTransaction', PackageTransactionSchema);
type PackageTransactionDoc = ExtractDoc<typeof PackageTransactionSchema>;

export { PackageTransaction, PackageTransactionSchema, PackageTransactionDoc };
