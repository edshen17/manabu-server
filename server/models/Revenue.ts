import { createSchema, Type, typedModel, ExtractDoc } from 'ts-mongoose';

const RevenueSchema = createSchema({
  revenue: Type.object({ required: false }),
  date: Type.string({ required: true }),
});

const Revenue = typedModel('Revenue', RevenueSchema);
type RevenueDoc = ExtractDoc<typeof RevenueSchema>;

export { Revenue, RevenueSchema, RevenueDoc };
