import { createSchema, Type, typedModel } from 'ts-mongoose';
import { UserSchema } from './User';

const BalanceTransactionSchema = createSchema({
  userId: Type.ref(Type.objectId({ required: true, index: true })).to('User', UserSchema),
  balanceChange: Type.object({ required: true }),
  fees: Type.object({ required: true }),
  description: Type.string({ required: true }),
  date: Type.date({ default: Date.now }),
});

const BalanceTransaction = typedModel('BalanceTransaction', BalanceTransactionSchema);
export { BalanceTransaction, BalanceTransactionSchema };
