import { createSchema, Type, typedModel, ExtractDoc } from 'ts-mongoose';
import aggregatePaginate from 'mongoose-aggregate-paginate-v2';
import { UserSchema } from './User';

const TeacherSchema = createSchema({
  userId: Type.ref(Type.objectId({ required: true })).to('User', UserSchema),
});

TeacherSchema.plugin(aggregatePaginate);
const Teacher = typedModel('Teacher', TeacherSchema);
type TeacherDoc = ExtractDoc<typeof TeacherSchema>;

export { Teacher, TeacherSchema, TeacherDoc };
