import { createSchema, ExtractDoc, Type, typedModel } from 'ts-mongoose';
import { PackageSchema } from './Package';

const TeacherSchema = createSchema({
  approvalDate: Type.date({ required: false }),
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
  settings: Type.object({
    required: true,
  }).of({
    isHidden: Type.boolean({ required: true }),
    emailAlerts: Type.object({
      required: true,
    }).of({ packageTransactionCreation: Type.boolean() }),
  }),
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
  packages: Type.array({ required: true }).of(PackageSchema),
  createdDate: Type.date({ required: true }),
  lastModifiedDate: Type.date({ required: true }),
});

const Teacher = typedModel('Teacher', TeacherSchema);
type TeacherDoc = ExtractDoc<typeof TeacherSchema>;
enum TEACHER_EMAIL_ALERT_NAME {
  PACKAGE_TRANSACTION_CREATION = 'packageTransactionCreation',
}

export { Teacher, TeacherSchema, TeacherDoc, TEACHER_EMAIL_ALERT_NAME };
