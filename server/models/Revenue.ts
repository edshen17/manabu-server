import { createSchema, Type, typedModel } from 'ts-mongoose';

const RevenueSchema = createSchema({
  revenue: Type.object({ required: false }),
  date: Type.string({ required: true }),
});

const Revenue = typedModel('Revenue', RevenueSchema);

export { Revenue, RevenueSchema };
