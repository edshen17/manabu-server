import { createSchema, Type, typedModel } from 'ts-mongoose';

const UserSchema = createSchema({
  name: Type.string({ required: true, index: true }),
  email: Type.string({ required: true, index: true }),
  password: Type.string({ required: false }),
  profileImage: Type.string({ default: '' }),
  profileBio: Type.string({ default: '' }),
  dateRegistered: Type.date({ default: Date.now }),
  lastUpdated: Type.date({ default: Date.now }),
  languages: Type.array({ default: [] }),
  region: Type.string({ default: '' }),
  timezone: Type.string({ default: '' }),
  lastOnline: Type.date({ default: Date.now }),
  role: Type.string({ default: 'user', enum: ['user', 'teacher', 'admin'], index: true }),
  settings: Type.object({
    default: {
      currency: 'SGD',
    },
  }),
  membership: Type.array({ default: [] }),
  commMethods: Type.array({ default: [] }),
  emailVerified: Type.boolean({ default: false }),
  verificationToken: Type.string(),
});

const User = typedModel('User', UserSchema);
export { User, UserSchema };
