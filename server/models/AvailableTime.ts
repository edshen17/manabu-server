import { createSchema, Type, typedModel, ExtractDoc } from 'ts-mongoose';
import { UserSchema } from './User';

const AvailableTimeSchema = createSchema({
  hostedById: Type.ref(Type.objectId({ required: true, index: true })).to('User', UserSchema),
  startTime: Type.date({ required: true }),
  endTime: Type.date({ required: true }),
});

const AvailableTime = typedModel('AvailableTime', AvailableTimeSchema);
type AvailableTimeDoc = ExtractDoc<typeof AvailableTimeSchema>;

export { AvailableTime, AvailableTimeSchema, AvailableTimeDoc };
