import { createSchema, Type, typedModel } from 'ts-mongoose';
import aggregatePaginate from 'mongoose-aggregate-paginate-v2';
import { UserSchema } from './User';

const TeacherSchema = createSchema({
  userId: Type.ref(Type.objectId({ required: true })).to('User', UserSchema),
  dateApproved: Type.date({ required: false }),
  teachingLanguages: Type.array({ default: [] }),
  alsoSpeaks: Type.array({ default: [] }),
  introductionVideo: Type.array({ default: '' }),
  isApproved: Type.boolean({ default: false }),
  isHidden: Type.boolean({ default: false }),
  teacherType: Type.string({
    default: 'unlicensed',
    enum: ['licensed', 'unlicensed'],
    index: true,
  }),
  licensePath: Type.string({ default: '' }),
  hourlyRate: Type.object({
    default: {
      amount: '30',
      currency: 'SGD',
    },
  }),
  lessonCount: Type.number({ default: 0 }),
  studentCount: Type.number({ default: 0 }),
});

TeacherSchema.plugin(aggregatePaginate);
const Teacher = typedModel('Teacher', TeacherSchema);

export { Teacher };
