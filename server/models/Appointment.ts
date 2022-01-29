import { createSchema, ExtractDoc, Type, typedModel } from 'ts-mongoose';
import { LocationData } from '../components/entities/utils/locationDataHandler/locationDataHandler';
import { PackageTransactionDoc, PackageTransactionSchema } from './PackageTransaction';
import { JoinedUserDoc, UserSchema } from './User';

const AppointmentSchema = createSchema({
  hostedById: Type.ref(Type.objectId({ required: true, index: true })).to('User', UserSchema),
  reservedById: Type.ref(Type.objectId({ required: true, index: true })).to('User', UserSchema),
  packageTransactionId: Type.ref(Type.objectId({ required: false, index: true })).to(
    'PackageTransaction',
    PackageTransactionSchema
  ),
  startDate: Type.date({ required: true }),
  endDate: Type.date({ required: true }),
  status: Type.string({
    required: true,
    enum: ['pending', 'confirmed', 'cancelled', 'completed'],
  }),
  cancellationReason: Type.string({ required: false }),
  createdDate: Type.date({ required: true }),
  lastModifiedDate: Type.date({ required: true }),
});

const Appointment = typedModel('Appointment', AppointmentSchema);
type AppointmentDoc = ExtractDoc<typeof AppointmentSchema> & {
  packageTransactionData: PackageTransactionDoc;
  locationData: LocationData;
  hostedByData: JoinedUserDoc;
  reservedByData: JoinedUserDoc;
};

export { Appointment, AppointmentSchema, AppointmentDoc };
