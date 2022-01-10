import { createSchema, ExtractDoc, Type, typedModel } from 'ts-mongoose';

const IncomeReportSchema = createSchema({
  revenue: Type.number({ required: true }),
  wageExpense: Type.number({ required: true }),
  rentExpense: Type.number({ required: true }),
  advertisingExpense: Type.number({ required: true }),
  depreciationExpense: Type.number({ required: true }),
  suppliesExpense: Type.number({ required: true }),
  internetExpense: Type.number({ required: true }),
  totalExpense: Type.number({ required: true }),
  netIncome: Type.number({ required: true }),
  startDate: Type.date({ required: true, index: true }),
  endDate: Type.date({ required: true, index: true }),
  currency: Type.string({ required: true }),
  dateRangeKey: Type.string({ required: true, index: true }),
  createdDate: Type.date({ required: true }),
  lastModifiedDate: Type.date({ required: true }),
});

const IncomeReport = typedModel('IncomeReport', IncomeReportSchema);
type IncomeReportDoc = ExtractDoc<typeof IncomeReportSchema>;

export { IncomeReport, IncomeReportSchema, IncomeReportDoc };
