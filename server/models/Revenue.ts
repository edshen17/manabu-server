import { createSchema, ExtractDoc, Type, typedModel } from 'ts-mongoose';

const RevenueSchema = createSchema({
  revenue: Type.object({ required: true }),
  date: Type.string({ required: true }),
  creationDate: Type.date({ required: true }),
  lastModifiedDate: Type.date({ required: true }),
});

const Revenue = typedModel('Revenue', RevenueSchema);
type RevenueDoc = ExtractDoc<typeof RevenueSchema>;

export { Revenue, RevenueSchema, RevenueDoc };
