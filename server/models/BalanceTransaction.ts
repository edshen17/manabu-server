import { createSchema, ExtractDoc, Type, typedModel } from 'ts-mongoose';
import { PackageTransactionDoc, PackageTransactionSchema } from './PackageTransaction';
import { UserSchema } from './User';

const BalanceTransactionSchema = createSchema({
  userId: Type.ref(Type.objectId({ required: true, index: true })).to('User', UserSchema),
  status: Type.string({ required: true }),
  description: Type.string({ required: true }),
  currency: Type.string({ required: true }),
  amount: Type.number({ required: true }),
  type: Type.string({ required: true, enum: ['packageTransaction'] }),
  packageTransactionId: Type.ref(Type.objectId({ required: true, index: true })).to(
    'PackageTransaction',
    PackageTransactionSchema
  ),
  runningBalance: Type.object({ required: false }).of({
    totalAvailable: Type.number(),
    currency: Type.string(),
  }),
  creationDate: Type.date({ required: true }),
  lastModifiedDate: Type.date({ required: true }),
});

// priceData: Type.object({ required: true }).of({
//   currency: Type.string(),
//   subTotal: Type.number(),
//   total: Type.number(),
// }),
// paymentData: Type.object({ required: false }).of({
//   gateway: Type.string({ required: false, enum: ['paypal', 'stripe', 'paynow'] }),
//   id: Type.string({
//     required: false,
//   }),
// }),
const BalanceTransaction = typedModel('BalanceTransaction', BalanceTransactionSchema);
type BalanceTransactionDoc = ExtractDoc<typeof BalanceTransactionSchema> & {
  packageTransactionData: PackageTransactionDoc;
};

export { BalanceTransaction, BalanceTransactionSchema, BalanceTransactionDoc };
