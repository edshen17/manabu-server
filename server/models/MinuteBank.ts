import { createSchema, Type, typedModel, ExtractDoc } from 'ts-mongoose';
import { JoinedUserDoc, UserSchema } from './User';

const MinuteBankSchema = createSchema({
  hostedById: Type.ref(Type.objectId({ required: true, index: true })).to('User', UserSchema),
  reservedById: Type.ref(Type.objectId({ required: true, index: true })).to('User', UserSchema),
  minuteBank: Type.number({ required: true }),
  createdDate: Type.date({ required: true }),
  lastModifiedDate: Type.date({ required: true }),
});

const MinuteBank = typedModel('MinuteBank', MinuteBankSchema);
type MinuteBankDoc = ExtractDoc<typeof MinuteBankSchema> & {
  hostedByData: JoinedUserDoc;
  reservedByData: JoinedUserDoc;
};

export { MinuteBank, MinuteBankSchema, MinuteBankDoc };
