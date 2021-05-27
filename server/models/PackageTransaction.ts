import { createSchema, Type, typedModel, ExtractDoc } from 'ts-mongoose';
import { UserSchema } from './User';
import { PackageSchema } from './Package';

const PackageTransactionSchema = createSchema({
  hostedBy: Type.ref(Type.objectId({ required: true, index: true })).to('User', UserSchema),
  reservedBy: Type.ref(Type.objectId({ required: true, index: true })).to('User', UserSchema),
  packageId: Type.ref(Type.objectId({ required: true, index: true })).to('Package', PackageSchema),
  transactionDate: Type.date({ default: Date.now }),
  reservationLength: Type.number({ required: true }),
  transactionDetails: Type.object({ required: false }),
  terminationDate: Type.date({ required: true }),
  isTerminated: Type.boolean({ default: false }),
  remainingAppointments: Type.number({ required: true }),
  remainingReschedules: Type.number({ required: false, default: 5 }),
  lessonLanguage: Type.string({ required: true }),
  isSubscription: Type.boolean({ required: true }),
  methodData: Type.object({ required: false }),
  packageData: Type.object({ required: false }),
  hostedByData: Type.object({ required: false }),
  reservedByData: Type.object({ required: false }),
});

const PackageTransaction = typedModel('PackageTransaction', PackageTransactionSchema);
type PackageTransactionDoc = ExtractDoc<typeof PackageTransactionSchema>;

export { PackageTransaction, PackageTransactionSchema, PackageTransactionDoc };
