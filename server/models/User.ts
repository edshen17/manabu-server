import mongooseUniqueValidator from 'mongoose-unique-validator';
import mongoosePaginate from 'mongoose-paginate-v2';
import { createSchema, Type, typedModel, ExtractDoc } from 'ts-mongoose';
import { TeacherSchema } from './Teacher';

const UserContactMethodEmbed = {
  methodName: Type.string({ required: true }),
  methodAddress: Type.string({ required: true }),
  isPrimaryMethod: Type.boolean({ required: true }),
  methodType: Type.string({ required: true, enum: ['online', 'offline'] }),
};

const UserSchema = createSchema({
  name: Type.string({ required: true, index: true }),
  email: Type.string({ required: true, index: true, unique: true }),
  password: Type.string({ required: false }),
  profileImageUrl: Type.string({ required: false }),
  profileBio: Type.string({ required: false }),
  registrationDate: Type.date({ default: Date.now }),
  languages: Type.array({ required: true }).of({
    language: Type.string(),
    level: Type.string(),
  }),
  region: Type.string({ required: false }),
  timezone: Type.string({ required: false }),
  lastOnline: Type.date({ default: Date.now }),
  role: Type.string({ required: true, enum: ['user', 'teacher', 'admin'], index: true }),
  settings: Type.object({
    required: true,
  }).of({
    currency: Type.string(),
  }),
  memberships: Type.array({ required: true }).of({
    name: Type.string(),
    dateJoined: Type.date(),
  }),
  contactMethods: Type.array({ required: true }).of(UserContactMethodEmbed),
  isEmailVerified: Type.boolean({ required: true }),
  verificationToken: Type.string({ required: true }),
  lastUpdated: Type.date({ required: true }),
  teacherData: Type.schema({ required: false }).of(TeacherSchema),
  nameNGrams: Type.string({ required: true }),
  namePrefixNGrams: Type.string({ required: true }),
});

UserSchema.plugin(mongooseUniqueValidator);
UserSchema.plugin(mongoosePaginate);
UserSchema.index(
  { nameNGrams: 'text', namePrefixNGrams: 'text' },
  { weights: { nameNGrams: 100, namePrefixNGrams: 200 } }
);

const User = typedModel('User', UserSchema);
type JoinedUserDoc = ExtractDoc<typeof UserSchema>;
export { User, UserSchema, JoinedUserDoc, UserContactMethodEmbed };
