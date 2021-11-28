import { createSchema, ExtractDoc, Type, typedModel } from 'ts-mongoose';
import { UserSchema } from './User';

const BalanceTransactionSchema = createSchema({
  userId: Type.ref(Type.objectId({ required: true, index: true })).to('User', UserSchema),
  balanceChange: Type.object({ required: true }).of({}),
  fees: Type.object({ required: true }).of({}),
  description: Type.string({ required: true }),
  date: Type.date({ required: true }),
  // createdDate or creationDate for consistency?
  createdDate: Type.date({ required: true }),
  lastModifiedDate: Type.date({ required: true }),
});

const BalanceTransaction = typedModel('BalanceTransaction', BalanceTransactionSchema);
type BalanceTransactionDoc = ExtractDoc<typeof BalanceTransactionSchema>;

export { BalanceTransaction, BalanceTransactionSchema, BalanceTransactionDoc };

