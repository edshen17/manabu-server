import { createSchema, ExtractDoc, Type, typedModel } from 'ts-mongoose';
import { UserSchema } from './User';

const BalanceTransactionSchema = createSchema({
  userId: Type.ref(Type.objectId({ required: true, index: true })).to('User', UserSchema),
  status: Type.string({ required: true }),
  description: Type.string({ required: true }),
  currency: Type.string({ required: true }),
  amount: Type.number({ required: true }),
  type: Type.string({ required: true, enum: ['packageSale'] }),
  packageTransactionId: Type.string({ required: false }),
  runningBalance: Type.object({ required: false }).of({
    totalAvailable: Type.number(),
    currency: Type.string(),
  }),
  creationDate: Type.date({ required: true }),
  lastModifiedDate: Type.date({ required: true }),
});

const BalanceTransaction = typedModel('BalanceTransaction', BalanceTransactionSchema);
type BalanceTransactionDoc = ExtractDoc<typeof BalanceTransactionSchema>;

export { BalanceTransaction, BalanceTransactionSchema, BalanceTransactionDoc };
