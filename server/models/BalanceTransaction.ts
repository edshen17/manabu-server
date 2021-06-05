import { createSchema, Type, typedModel, ExtractDoc } from 'ts-mongoose';
import { UserSchema } from './User';

const BalanceTransactionSchema = createSchema({
  userId: Type.ref(Type.objectId({ required: true, index: true })).to('User', UserSchema),
  balanceChange: Type.object({ required: true }).of({}),
  fees: Type.object({ required: true }).of({}),
  description: Type.string({ required: true }),
  date: Type.date({ default: Date.now }),
});

const BalanceTransaction = typedModel('BalanceTransaction', BalanceTransactionSchema);
type BalanceTransactionDoc = ExtractDoc<typeof BalanceTransactionSchema>;

export { BalanceTransaction, BalanceTransactionSchema, BalanceTransactionDoc };
