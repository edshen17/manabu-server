import { createSchema, Type, typedModel, ExtractDoc } from 'ts-mongoose';

const UserSchema = createSchema({
  name: Type.string({ required: true, index: true }),
  email: Type.string({ required: true, index: true, unique: true }),
  password: Type.string({ required: false }),
  profileImageUrl: Type.string({ required: false }),
  profileBio: Type.string({ required: false }),
  dateRegistered: Type.date({ default: Date.now }),
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
  contactMethods: Type.array({ required: true }).of({
    methodName: Type.string({ required: true }),
    methodId: Type.string({ required: true }),
    isPrimaryMethod: Type.boolean({ required: true }),
    methodType: Type.string({ required: true }),
  }),
  isEmailVerified: Type.boolean({ required: true }),
  verificationToken: Type.string({ required: true }),
});

const User = typedModel('User', UserSchema);
type UserDoc = ExtractDoc<typeof UserSchema>;

export { User, UserSchema, UserDoc };
