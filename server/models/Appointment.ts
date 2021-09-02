import { createSchema, ExtractDoc, Type, typedModel } from 'ts-mongoose';
import { PackageTransactionDoc, PackageTransactionSchema } from './PackageTransaction';
import { UserSchema } from './User';

const AppointmentSchema = createSchema({
  hostedById: Type.ref(Type.objectId({ required: true, index: true })).to('User', UserSchema),
  reservedById: Type.ref(Type.objectId({ required: true, index: true })).to('User', UserSchema),
  packageTransactionId: Type.ref(Type.objectId({ required: true, index: true })).to(
    'PackageTransaction',
    PackageTransactionSchema
  ),
  startDate: Type.date({ required: true }),
  endDate: Type.date({ required: true }),
  isPast: Type.boolean({ required: true }),
  status: Type.string({
    required: true,
    enum: ['pending', 'confirmed', 'cancelled'],
  }),
  cancellationReason: Type.string({ required: false }),
  createdDate: Type.date({ required: true }),
  lastModifiedDate: Type.date({ required: true }),
});

const Appointment = typedModel('Appointment', AppointmentSchema);
type AppointmentDoc = ExtractDoc<typeof AppointmentSchema> & {
  packageTransactionData: PackageTransactionDoc;
};

export { Appointment, AppointmentSchema, AppointmentDoc };
