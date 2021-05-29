import { createSchema, Type, typedModel, ExtractDoc } from 'ts-mongoose';
import { UserSchema } from './User';

const PackageSchema = createSchema({
  hostedBy: Type.ref(Type.objectId({ required: true, index: true })).to('User', UserSchema),
  priceDetails: Type.object({ required: true }).of({
    hourlyPrice: Type.string({ default: '35' }),
    currency: Type.string({ default: 'SGD' }),
  }),
  lessonAmount: Type.number({ required: true }),
  packageDesc: Type.string({ required: false }),
  packageName: Type.string({ required: false }),
  isOffering: Type.boolean({ default: true }),
  packageType: Type.string({
    enum: ['mainichi', 'moderate', 'light', 'internal'],
    required: true,
  }),
  packageDurations: Type.array({ required: true }).of(Type.string({ required: false })),
  tags: Type.array({ required: false }).of(Type.string({ required: false })),
});

const Package = typedModel('Package', PackageSchema);
type PackageDoc = ExtractDoc<typeof PackageSchema>;

export { Package, PackageSchema, PackageDoc };
