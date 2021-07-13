import { createSchema, Type, typedModel, ExtractDoc } from 'ts-mongoose';
import { JoinedUserDoc, UserSchema } from './User';

const MinuteBankSchema = createSchema({
  hostedById: Type.ref(Type.objectId({ required: true, index: true })).to('User', UserSchema),
  reservedById: Type.ref(Type.objectId({ required: true, index: true })).to('User', UserSchema),
  minuteBank: Type.number({ required: true }),
  hostedByData: Type.object({ required: true }).of({}),
  reservedByData: Type.object({ required: true }).of({}),
});

const MinuteBank = typedModel('MinuteBank', MinuteBankSchema);
type MinuteBankDoc = ExtractDoc<typeof MinuteBankSchema> & {
  hostedByData: JoinedUserDoc;
  reservedByData: JoinedUserDoc;
};

export { MinuteBank, MinuteBankSchema, MinuteBankDoc };
