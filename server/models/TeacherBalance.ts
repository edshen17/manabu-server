import { createSchema, Type, typedModel, ExtractDoc } from 'ts-mongoose';
import { UserSchema } from './User';

const TeacherBalanceSchema = createSchema({
  userId: Type.ref(Type.objectId({ required: true, index: true })).to('User', UserSchema),
  balanceDetails: Type.object({
    default: {
      balance: 0,
      currency: 'SGD',
    },
  }).of({}),
});

const TeacherBalance = typedModel('TeacherBalance', TeacherBalanceSchema);
type TeacherBalanceDoc = ExtractDoc<typeof TeacherBalanceSchema>;

export { TeacherBalance, TeacherBalanceSchema, TeacherBalanceDoc };
