import { createSchema, ExtractDoc, Type, typedModel } from 'ts-mongoose';
import { UserSchema } from './User';

const AvailableTimeSchema = createSchema({
  hostedById: Type.ref(Type.objectId({ required: true, index: true })).to('User', UserSchema),
  startDate: Type.date({ required: true }),
  endDate: Type.date({ required: true }),
  creationDate: Type.date({ required: true }),
  lastModifiedDate: Type.date({ required: true }),
});

const AvailableTime = typedModel('AvailableTime', AvailableTimeSchema);
type AvailableTimeDoc = ExtractDoc<typeof AvailableTimeSchema>;

export { AvailableTime, AvailableTimeSchema, AvailableTimeDoc };
