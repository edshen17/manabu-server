import { createSchema, Type, typedModel, ExtractDoc } from 'ts-mongoose';
import aggregatePaginate from 'mongoose-aggregate-paginate-v2';
import { PackageSchema } from './Package';

const TeacherSchema = createSchema({
  // userId: Type.objectId({ required: true, index: true, unique: true }),
  dateApproved: Type.date({ required: false }),
  teachingLanguages: Type.array({ required: true }).of({
    language: Type.string(),
    level: Type.string(),
  }),
  alsoSpeaks: Type.array({ required: true }).of({
    language: Type.string(),
    level: Type.string(),
  }),
  introductionVideoUrl: Type.string({ required: false }),
  applicationStatus: Type.string({ required: true, enum: ['pending', 'approved', 'rejected'] }),
  isHidden: Type.boolean({ required: true }),
  teacherType: Type.string({
    required: true,
    enum: ['licensed', 'unlicensed'],
    index: true,
  }),
  licensePathUrl: Type.string({ required: false }),
  priceData: Type.object({ required: true }).of({
    hourlyRate: Type.number(),
    currency: Type.string(),
  }),
  tags: Type.array({ required: true }).of(Type.string({ required: false })),
  lessonCount: Type.number({ required: true }),
  studentCount: Type.number({ required: true }),
  lastUpdated: Type.date({ required: true }),
  packages: Type.array({ required: true }).of(PackageSchema),
});

TeacherSchema.plugin(aggregatePaginate);
const Teacher = typedModel('Teacher', TeacherSchema);
type TeacherDoc = ExtractDoc<typeof TeacherSchema>;

export { Teacher, TeacherSchema, TeacherDoc };
