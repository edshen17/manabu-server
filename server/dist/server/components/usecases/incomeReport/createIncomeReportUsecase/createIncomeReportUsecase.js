"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateIncomeReportUsecase = void 0;
const AbstractCreateUsecase_1 = require("../../abstractions/AbstractCreateUsecase");
class CreateIncomeReportUsecase extends AbstractCreateUsecase_1.AbstractCreateUsecase {
    _incomeReportEntity;
    _makeRequestTemplate = async (props) => {
        const { body, dbServiceAccessOptions } = props;
        const incomeReportEntity = await this._incomeReportEntity.build(body);
        const { dateRangeKey } = incomeReportEntity;
        let incomeReport = await this._dbService.findOne({
            searchQuery: {
                dateRangeKey,
            },
            dbServiceAccessOptions,
        });
        if (!incomeReport) {
            incomeReport = await this._dbService.insert({
                modelToInsert: incomeReportEntity,
                dbServiceAccessOptions,
            });
        }
        else {
            const processedIncomeReportEntity = this._getProcessedIncomeReportEntity(incomeReportEntity);
            incomeReport = await this._dbService.findOneAndUpdate({
                searchQuery: { _id: incomeReport._id },
                updateQuery: { $inc: processedIncomeReportEntity },
                dbServiceAccessOptions,
            });
        }
        const usecaseRes = {
            incomeReport,
        };
        return usecaseRes;
    };
    _getProcessedIncomeReportEntity = (incomeReportEntity) => {
        const processedIncomeReportEntity = {};
        for (const property in incomeReportEntity) {
            const value = incomeReportEntity[property];
            const isNumber = typeof value === 'number';
            if (isNumber) {
                processedIncomeReportEntity[property] = value;
            }
        }
        return processedIncomeReportEntity;
    };
    _initTemplate = async (optionalInitParams) => {
        const { makeIncomeReportEntity } = optionalInitParams;
        this._incomeReportEntity = await makeIncomeReportEntity;
    };
}
exports.CreateIncomeReportUsecase = CreateIncomeReportUsecase;
