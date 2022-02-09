"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EditTeacherUsecase = void 0;
const AbstractEditUsecase_1 = require("../../abstractions/AbstractEditUsecase");
class EditTeacherUsecase extends AbstractEditUsecase_1.AbstractEditUsecase {
    _currency;
    _makeRequestTemplate = async (props) => {
        const { params, body, dbServiceAccessOptions } = props;
        const { priceData } = body || {};
        const { hourlyRate } = priceData || {};
        dbServiceAccessOptions.isReturningParent = true;
        if (hourlyRate) {
            priceData.hourlyRate = this._currency(priceData.hourlyRate).value;
        }
        const user = await this._dbService.findOneAndUpdate({
            searchQuery: { _id: params.teacherId },
            updateQuery: body,
            dbServiceAccessOptions,
        });
        const usecaseRes = { user };
        return usecaseRes;
    };
    _initTemplate = async (optionalInitParams) => {
        const { currency, makeEditEntityValidator } = optionalInitParams;
        this._currency = currency;
        this._editEntityValidator = makeEditEntityValidator;
    };
}
exports.EditTeacherUsecase = EditTeacherUsecase;
