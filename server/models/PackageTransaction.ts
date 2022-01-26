import { createSchema, ExtractDoc, Type, typedModel } from 'ts-mongoose';
import { PackageDoc, PackageSchema } from './Package';
import { JoinedUserDoc, UserSchema } from './User';

const PackageTransactionSchema = createSchema({
  hostedById: Type.ref(Type.objectId({ required: true, index: true })).to('User', UserSchema),
  reservedById: Type.ref(Type.objectId({ required: true, index: true })).to('User', UserSchema),
  packageId: Type.ref(Type.objectId({ required: true, index: true })).to('Package', PackageSchema),
  lessonDuration: Type.number({ required: true }),
  terminationDate: Type.date({ required: true }),
  isTerminated: Type.boolean({ required: true }),
  remainingAppointments: Type.number({ required: true }),
  lessonLanguage: Type.string({ required: true }),
  isSubscription: Type.boolean({ required: true }),
  status: Type.string({
    required: true,
    enum: ['pending', 'confirmed', 'cancelled', 'completed'],
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
