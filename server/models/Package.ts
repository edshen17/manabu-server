import { createSchema, ExtractDoc, Type, typedModel } from 'ts-mongoose';

const PackageSchema = createSchema({
  lessonAmount: Type.number({ required: true }),
  description: Type.string({ required: false }),
  name: Type.string({ required: true }),
  isOffering: Type.boolean({ required: true }),
  type: Type.string({
    enum: ['default', 'custom'],
    required: true,
  }),
  lessonDurations: Type.array({
    required: true,
  }).of(Type.number({ required: false })),
  tags: Type.array({ required: false }).of(Type.string({ required: false })),
  createdDate: Type.date({ required: true }),
  lastModifiedDate: Type.date({ required: true }),
});

const Package = typedModel('Package', PackageSchema);
type PackageDoc = ExtractDoc<typeof PackageSchema>;

export { Package, PackageSchema, PackageDoc };
