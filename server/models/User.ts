import { createSchema, Type, typedModel, ExtractDoc } from 'ts-mongoose';

const UserSchema = createSchema({
  name: Type.string({ required: true, index: true }),
});

const User = typedModel('User', UserSchema);
type UserDoc = ExtractDoc<typeof UserSchema>;

export { User, UserSchema, UserDoc };
