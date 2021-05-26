import { createSchema, Type, typedModel } from 'ts-mongoose';
import { UserSchema } from './User';

const MinuteBankSchema = createSchema({
  hostedBy: Type.ref(Type.objectId({ required: true, index: true })).to('User', UserSchema),
  reservedBy: Type.ref(Type.objectId({ required: true, index: true })).to('User', UserSchema),
  minuteBank: Type.number({ default: 0 }),
  hostedByData: Type.object({ required: false }),
  reservedByData: Type.object({ required: false }),
  lastUpdated: Type.date({ default: Date.now }),
});

const MinuteBank = typedModel('MinuteBank', MinuteBankSchema);

export { MinuteBank, MinuteBankSchema };
