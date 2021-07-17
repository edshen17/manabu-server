import { createSchema, Type, typedModel, ExtractDoc } from 'ts-mongoose';

const PackageSchema = createSchema({
  hostedById: Type.objectId({ required: true, index: true }),
  priceData: Type.object({
    required: true,
  }).of({
    hourlyPrice: Type.string(),
    currency: Type.string(),
  }),
  lessonAmount: Type.number({ required: true }),
  packageDesc: Type.string({ required: false }),
  packageName: Type.string({ required: true }),
  isOffering: Type.boolean({ required: true }),
  packageType: Type.string({
    enum: ['default', 'custom'],
    required: true,
  }),
  lessonDurations: Type.array({ required: true }).of(Type.number({ required: false })),
  tags: Type.array({ required: false }).of(Type.string({ required: false })),
  lastUpdated: Type.date({ required: true }),
});

const Package = typedModel('Package', PackageSchema);
type PackageDoc = ExtractDoc<typeof PackageSchema>;

export { Package, PackageSchema, PackageDoc };
