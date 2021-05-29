import { createSchema, Type, typedModel, ExtractDoc } from 'ts-mongoose';
import aggregatePaginate from 'mongoose-aggregate-paginate-v2';
import { UserSchema } from './User';

const TeacherSchema = createSchema({
  userId: Type.ref(Type.objectId({ required: true })).to('User', UserSchema),
  dateApproved: Type.date({ required: false }),
  teachingLanguages: Type.array({ default: [] }).of({
    language: Type.string({ required: false }),
    level: Type.string({ required: false }),
  }),
  alsoSpeaks: Type.array({ default: [] }).of({
    language: Type.string({ required: false }),
    level: Type.string({ required: false }),
  }),
  introductionVideo: Type.string({ default: '' }),
  isApproved: Type.boolean({ default: false }),
  isHidden: Type.boolean({ default: false }),
  teacherType: Type.string({
    default: 'unlicensed',
    enum: ['licensed', 'unlicensed'],
    index: true,
  }),
  licensePath: Type.string({ default: '' }),
  hourlyRate: Type.object({ required: false }).of({
    amount: Type.string({ default: '30' }),
    currency: Type.string({ default: 'SGD' }),
  }),
  lessonCount: Type.number({ default: 0 }),
  studentCount: Type.number({ default: 0 }),
});

TeacherSchema.plugin(aggregatePaginate);
const Teacher = typedModel('Teacher', TeacherSchema);
type TeacherDoc = ExtractDoc<typeof TeacherSchema>;

export { Teacher, TeacherSchema, TeacherDoc };
