import { createSchema, Type, typedModel, ExtractDoc } from 'ts-mongoose';
import { UserSchema } from './User';
import { PackageTransactionDoc, PackageTransactionSchema } from './PackageTransaction';

const AppointmentSchema = createSchema({
  hostedById: Type.ref(Type.objectId({ required: true, index: true })).to('User', UserSchema),
  reservedById: Type.ref(Type.objectId({ required: true, index: true })).to('User', UserSchema),
  packageTransactionId: Type.ref(Type.objectId({ required: true, index: true })).to(
    'PackageTransaction',
    PackageTransactionSchema
  ),
  startTime: Type.date({ required: true }),
  endTime: Type.date({ required: true }),
  isPast: Type.boolean({ required: true }),
  status: Type.string({
    required: true,
    enum: ['pending', 'confirmed', 'cancelled'],
  }),
  cancellationReason: Type.string({ required: false }),
  lastUpdated: Type.date({ required: true }),
});

const Appointment = typedModel('Appointment', AppointmentSchema);
type AppointmentDoc = ExtractDoc<typeof AppointmentSchema> & {
  packageTransactionData: PackageTransactionDoc;
};

export { Appointment, AppointmentSchema, AppointmentDoc };
