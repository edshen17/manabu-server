import { createSchema, ExtractDoc, Type, typedModel } from 'ts-mongoose';
import { PackageDoc, PackageSchema } from './Package';
import { JoinedUserDoc, UserSchema } from './User';

const PackageTransactionSchema = createSchema({
  hostedById: Type.ref(Type.objectId({ required: true, index: true })).to('User', UserSchema),
  reservedById: Type.ref(Type.objectId({ required: true, index: true })).to('User', UserSchema),
  packageId: Type.ref(Type.objectId({ required: true, index: true })).to('Package', PackageSchema),
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
    gateway: Type.string({ required: true }),
    id: Type.string({
      required: true,
      enum: ['paypal', 'stripe', 'paynow'],
    }),
  }),
  status: Type.string({
    required: true,
    enum: ['pending', 'confirmed', 'cancelled'],
  }),
  lastModifiedDate: Type.date({ required: true }),
  createdDate: Type.date({ required: true }),
});

const PackageTransaction = typedModel('PackageTransaction', PackageTransactionSchema);
type PackageTransactionDoc = ExtractDoc<typeof PackageTransactionSchema> & {
  packageData: PackageDoc;
  hostedByData: JoinedUserDoc;
  reservedByData: JoinedUserDoc;
};

export { PackageTransaction, PackageTransactionSchema, PackageTransactionDoc };
