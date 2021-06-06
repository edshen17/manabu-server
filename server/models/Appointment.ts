import { createSchema, Type, typedModel, ExtractDoc } from 'ts-mongoose';
import { UserSchema } from './User';
import { PackageTransactionSchema } from './PackageTransaction';

const AppointmentSchema = createSchema({
  hostedBy: Type.ref(Type.objectId({ required: true, index: true })).to('User', UserSchema),
  reservedBy: Type.ref(Type.objectId({ required: true, index: true })).to('User', UserSchema),
  packageTransactionId: Type.ref(Type.objectId({ required: true, index: true })).to(
    'PackageTransaction',
    PackageTransactionSchema
  ),
  from: Type.string({ required: true }),
  to: Type.string({ required: true }),
  isPast: Type.boolean({ required: true }),
  status: Type.string({
    required: true,
    enum: ['confirmed', 'pending', 'cancelled'],
  }),
  cancellationReason: Type.string({ required: true }),
  packageTransactionData: Type.object({ required: true }).of({}),
  location: Type.object({ required: true }).of({}),
});

const Appointment = typedModel('Appointment', AppointmentSchema);
type AppointmentDoc = ExtractDoc<typeof AppointmentSchema>;

export { Appointment, AppointmentSchema, AppointmentDoc };
