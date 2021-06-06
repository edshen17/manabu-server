import { createSchema, Type, typedModel, ExtractDoc } from 'ts-mongoose';
import aggregatePaginate from 'mongoose-aggregate-paginate-v2';
import { UserSchema } from './User';

const TeacherSchema = createSchema({
  userId: Type.ref(Type.objectId({ required: true, index: true, unique: true })).to(
    'User',
    UserSchema
  ),
  dateApproved: Type.date({ required: false }),
  teachingLanguages: Type.array({ required: true }).of({
    language: Type.string(),
    level: Type.string(),
  }),
  alsoSpeaks: Type.array({ required: true }).of({
    language: Type.string(),
    level: Type.string(),
  }),
  introductionVideo: Type.string({ required: false }),
  isApproved: Type.boolean({ default: false }),
  isHidden: Type.boolean({ default: false }),
  teacherType: Type.string({
    required: true,
    enum: ['licensed', 'unlicensed'],
    index: true,
  }),
  licensePath: Type.string({ required: false }),
  hourlyRate: Type.object({ required: true }).of({
    amount: Type.string(),
    currency: Type.string(),
  }),
  lessonCount: Type.number({ required: true }),
  studentCount: Type.number({ required: true }),
});

TeacherSchema.plugin(aggregatePaginate);
const Teacher = typedModel('Teacher', TeacherSchema);
type TeacherDoc = ExtractDoc<typeof TeacherSchema>;

export { Teacher, TeacherSchema, TeacherDoc };
