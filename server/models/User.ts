import { createSchema, Type, typedModel, ExtractDoc } from 'ts-mongoose';

const UserSchema = createSchema({
  name: Type.string({ required: true, index: true }),
  email: Type.string({ required: true, index: true }),
  password: Type.string({ required: false }),
  profileImage: Type.string({ default: '' }),
  profileBio: Type.string({ default: '' }),
  dateRegistered: Type.date({ default: Date.now }),
  lastUpdated: Type.date({ default: Date.now }),
  languages: Type.array({ default: [] }).of({
    language: Type.string({ required: false }),
    level: Type.string({ required: false }),
  }),
  region: Type.string({ default: '' }),
  timezone: Type.string({ default: '' }),
  lastOnline: Type.date({ default: Date.now }),
  role: Type.string({ default: 'user', enum: ['user', 'teacher', 'admin'], index: true }),
  settings: Type.object({
    required: false,
  }).of({
    currency: Type.string({ required: false, default: 'SGD' }),
  }),
  membership: Type.array({ default: [] }).of(Type.string({ required: false })),
  commMethods: Type.array({ default: [] }).of({
    method: Type.string({ required: false }),
    id: Type.string({ required: false }),
  }),
  emailVerified: Type.boolean({ default: false }),
  verificationToken: Type.string(),
});

const User = typedModel('User', UserSchema);
type UserDoc = ExtractDoc<typeof UserSchema>;

export { User, UserSchema, UserDoc };
