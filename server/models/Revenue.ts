import { createSchema, Type, typedModel, ExtractDoc } from 'ts-mongoose';

const RevenueSchema = createSchema({
  revenue: Type.object({ required: true }),
  date: Type.string({ required: true }),
  createdDate: Type.date({ required: true }),
  lastModifiedDate: Type.date({ required: true }),
});

const Revenue = typedModel('Revenue', RevenueSchema);
type RevenueDoc = ExtractDoc<typeof RevenueSchema>;

export { Revenue, RevenueSchema, RevenueDoc };
