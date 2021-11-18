import { createSchema, ExtractDoc, Type, typedModel } from 'ts-mongoose';
import { PackageTransactionDoc, PackageTransactionSchema } from './PackageTransaction';
import { UserSchema } from './User';

const BalanceTransactionSchema = createSchema({
  userId: Type.ref(Type.objectId({ required: true, index: true })).to('User', UserSchema),
  status: Type.string({ required: true }),
  currency: Type.string({ required: true }),
  type: Type.string({ required: true, enum: ['packageTransaction'] }),
  packageTransactionId: Type.ref(Type.objectId({ required: true, index: true })).to(
    'PackageTransaction',
    PackageTransactionSchema
  ),
  balanceChange: Type.number({ required: true }),
  processingFee: Type.number({ required: true }),
  tax: Type.number({ required: true }),
  totalPaid: Type.number({ required: true }),
  runningBalance: Type.object({ required: true }).of({
    totalAvailable: Type.number(),
    currency: Type.string(),
  }),
  paymentData: Type.object({ required: false }).of({
    gateway: Type.string({ required: false, enum: ['paypal', 'stripe', 'paynow', ''] }),
    id: Type.string({
      required: false,
    }),
  }),
  creationDate: Type.date({ required: true }),
  lastModifiedDate: Type.date({ required: true }),
});

const BalanceTransaction = typedModel('BalanceTransaction', BalanceTransactionSchema);
type BalanceTransactionDoc = ExtractDoc<typeof BalanceTransactionSchema> & {
  packageTransactionData: PackageTransactionDoc;
};

export { BalanceTransaction, BalanceTransactionSchema, BalanceTransactionDoc };
