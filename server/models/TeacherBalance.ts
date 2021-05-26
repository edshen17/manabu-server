import { createSchema, Type, typedModel } from 'ts-mongoose';
import { UserSchema } from './User';

const TeacherBalanceSchema = createSchema({
  userId: Type.ref(Type.objectId({ required: true, index: true })).to('User', UserSchema),
  balanceDetails: Type.object({
    default: {
      balance: 0,
      currency: 'SGD',
    },
  }),
});

const TeacherBalance = typedModel('TeacherBalance', TeacherBalanceSchema);

export { TeacherBalance, TeacherBalanceSchema };
