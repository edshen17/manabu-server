import { createSchema, Type, typedModel, ExtractDoc } from 'ts-mongoose';
import { UserSchema } from './User';

const TeacherBalanceSchema = createSchema({
  userId: Type.ref(Type.objectId({ required: true, index: true })).to('User', UserSchema),
  balance: Type.number({ required: true }),
  currency: Type.string({ required: true }),
});

const TeacherBalance = typedModel('TeacherBalance', TeacherBalanceSchema);
type TeacherBalanceDoc = ExtractDoc<typeof TeacherBalanceSchema>;

export { TeacherBalance, TeacherBalanceSchema, TeacherBalanceDoc };
