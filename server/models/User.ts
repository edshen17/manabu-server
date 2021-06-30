import { createSchema, Type, typedModel, ExtractDoc } from 'ts-mongoose';

const UserSchema = createSchema({
  name: Type.string({ required: true, index: true }),
  email: Type.string({ required: true, index: true, unique: true }),
  password: Type.string({ required: false }),
  profileImage: Type.string({ required: false }),
  profileBio: Type.string({ required: false }),
  dateRegistered: Type.date({ default: Date.now }),
  lastUpdated: Type.date({ default: Date.now }),
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
  membership: Type.array({ required: true }).of(Type.string()),
  commMethods: Type.array({ required: true }).of({
    method: Type.string(),
    id: Type.string(),
  }),
  isEmailVerified: Type.boolean({ required: true }),
  verificationToken: Type.string({ required: true }),
});

const User = typedModel('User', UserSchema);
type UserDoc = ExtractDoc<typeof UserSchema>;

export { User, UserSchema, UserDoc };
