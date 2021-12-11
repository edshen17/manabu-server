import mongooseUniqueValidator from 'mongoose-unique-validator';
import { createSchema, ExtractDoc, Type, typedModel } from 'ts-mongoose';
import { TeacherSchema } from './Teacher';

const UserContactMethodEmbed = {
  methodName: Type.string({ required: true }),
  methodAddress: Type.string({ required: true }),
  isPrimaryMethod: Type.boolean({ required: true }),
  methodType: Type.string({ required: true, enum: ['online', 'offline'] }),
};

const UserEmailAlertsEmbed = {
  packageTransactionCreation: Type.boolean({ required: true }),
  appointmentCreation: Type.boolean({ required: true }),
  appointmentUpdate: Type.boolean({ required: true }),
  appointmentStartReminder: Type.boolean({ required: true }),
};

const UserSchema = createSchema({
  name: Type.string({ required: true, index: true }),
  email: Type.string({ required: true, index: true, unique: true }),
  password: Type.string({ required: false }),
  profileImageUrl: Type.string({ required: false }),
  profileBio: Type.string({ required: false }),
  languages: Type.array({ required: true }).of({
    language: Type.string({ required: true }),
    level: Type.string({ required: true }),
  }),
  region: Type.string({ required: false }),
  timezone: Type.string({ required: false }),
  role: Type.string({ required: true, enum: ['user', 'teacher', 'admin'], index: true }),
  settings: Type.object({
    required: true,
  }).of({
    currency: Type.string({ required: true }),
    locale: Type.string({ required: true }),
    emailAlerts: Type.object({
      required: true,
    }).of(UserEmailAlertsEmbed),
  }),
  memberships: Type.array({ required: true }).of({
    name: Type.string(),
    dateJoined: Type.date(),
  }),
  contactMethods: Type.array({ required: true }).of(UserContactMethodEmbed),
  isEmailVerified: Type.boolean({ required: true }),
  verificationToken: Type.string({ required: true }),
  teacherData: Type.schema({ required: false }).of(TeacherSchema),
  nameNGrams: Type.string({ required: true }),
  namePrefixNGrams: Type.string({ required: true }),
  createdDate: Type.date({ required: true }),
  lastModifiedDate: Type.date({ required: true }),
  lastOnlineDate: Type.date({ required: true }),
  balance: Type.object({ required: true }).of({
    totalCurrent: Type.number({ required: true }),
    totalPending: Type.number({ required: true }),
    totalAvailable: Type.number({ required: true }),
    currency: Type.string({ required: true }),
  }),
});

UserSchema.plugin(mongooseUniqueValidator);
UserSchema.index(
  { nameNGrams: 'text', namePrefixNGrams: 'text' },
  { weights: { nameNGrams: 100, namePrefixNGrams: 200 } }
);

const User = typedModel('User', UserSchema);
type JoinedUserDoc = ExtractDoc<typeof UserSchema>;

export { User, UserSchema, JoinedUserDoc, UserContactMethodEmbed, UserEmailAlertsEmbed };
