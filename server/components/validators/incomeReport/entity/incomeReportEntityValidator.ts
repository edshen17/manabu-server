import { AbstractEntityValidator } from '../../abstractions/AbstractEntityValidator';

class IncomeReportEntityValidator extends AbstractEntityValidator {
  protected _initValidationSchemas = (): void => {
    this._createValidationSchema = this._joi.object().keys({
      revenue: this._joi.number().min(0),
      wageExpense: this._joi.number(),
      rentExpense: this._joi.number(),
      advertisingExpense: this._joi.number(),
      depreciationExpense: this._joi.number(),
      suppliesExpense: this._joi.number(),
      internetExpense: this._joi.number(),
      totalExpense: this._joi.number(),
      netIncome: this._joi.number(),
      startDate: this._joi.date(),
      endDate: this._joi.date(),
      createdDate: this._joi.date(),
      lastModifiedDate: this._joi.date(),
    });
    this._editValidationSchema = this._createValidationSchema.keys({
      revenue: this._joi.forbidden(),
      wageExpense: this._joi.forbidden(),
      rentExpense: this._joi.forbidden(),
      advertisingExpense: this._joi.forbidden(),
      depreciationExpense: this._joi.forbidden(),
      suppliesExpense: this._joi.forbidden(),
      internetExpense: this._joi.forbidden(),
      totalExpense: this._joi.forbidden(),
      netIncome: this._joi.forbidden(),
      startDate: this._joi.forbidden(),
      endDate: this._joi.forbidden(),
      createdDate: this._joi.forbidden(),
      lastModifiedDate: this._joi.forbidden(),
    });
    this._deleteValidationSchema = this._createValidationSchema.keys({
      _id: this._joi
        .alternatives()
        .try(this._joi.string().alphanum().min(24).max(24), this._joi.objectId()),
    });
    this._adminValidationSchema = this._createValidationSchema;
  };
}

export { IncomeReportEntityValidator };
