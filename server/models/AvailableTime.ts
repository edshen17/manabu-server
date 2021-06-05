import { createSchema, Type, typedModel, ExtractDoc } from 'ts-mongoose';
import { UserSchema } from './User';

const AvailableTimeSchema = createSchema({
  hostedBy: Type.ref(Type.objectId({ required: true, index: true })).to('User', UserSchema),
  from: Type.string({ required: true }),
  to: Type.string({ required: true }),
  hostedByData: Type.object({ required: false }).of({}),
});

const AvailableTime = typedModel('AvailableTime', AvailableTimeSchema);
type AvailableTimeDoc = ExtractDoc<typeof AvailableTimeSchema>;

export { AvailableTime, AvailableTimeSchema, AvailableTimeDoc };
