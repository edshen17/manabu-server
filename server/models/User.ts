import { createSchema, Type, typedModel, ExtractDoc } from 'ts-mongoose';

const UserSchema = createSchema({
  name: Type.string({ required: true, index: true }),
  email: Type.string({ required: true, index: true, unique: true }),
  password: Type.string({ required: false }),
  profileImage: Type.string({ default: '' }),
  profileBio: Type.string({ default: '' }),
  dateRegistered: Type.date({ default: Date.now }),
  lastUpdated: Type.date({ default: Date.now }),
  languages: Type.array({ default: [] }).of({
    language: Type.string(),
    level: Type.string(),
  }),
  region: Type.string({ default: '' }),
  timezone: Type.string({ default: '' }),
  lastOnline: Type.date({ default: Date.now }),
  role: Type.string({ default: 'user', enum: ['user', 'teacher', 'admin'], index: true }),
  settings: Type.object({
    required: false,
    default: { currency: 'SGD' },
  }).of({
    currency: Type.string(),
  }),
  membership: Type.array({ default: [] }).of(Type.string()),
  commMethods: Type.array({ default: [] }).of({
    method: Type.string(),
    id: Type.string(),
  }),
  emailVerified: Type.boolean({ default: false }),
  verificationToken: Type.string({ default: '' }),
});

const User = typedModel('User', UserSchema);
type UserDoc = ExtractDoc<typeof UserSchema>;

export { User, UserSchema, UserDoc };
