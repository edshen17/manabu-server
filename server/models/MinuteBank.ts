import { createSchema, Type, typedModel, ExtractDoc } from 'ts-mongoose';
import { UserSchema } from './User';

const MinuteBankSchema = createSchema({
  hostedBy: Type.ref(Type.objectId({ required: true, index: true })).to('User', UserSchema),
  reservedBy: Type.ref(Type.objectId({ required: true, index: true })).to('User', UserSchema),
  minuteBank: Type.number({ default: 0 }),
  hostedByData: Type.object({ required: false }).of({}),
  reservedByData: Type.object({ required: false }).of({}),
  lastUpdated: Type.date({ default: Date.now }),
});

const MinuteBank = typedModel('MinuteBank', MinuteBankSchema);
type MinuteBankDoc = ExtractDoc<typeof MinuteBankSchema>;

export { MinuteBank, MinuteBankSchema, MinuteBankDoc };
