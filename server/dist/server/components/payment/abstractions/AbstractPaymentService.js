"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AbstractPaymentService = void 0;
class AbstractPaymentService {
    _paymentLib;
    executePayment = async (props) => {
        const createPaymentJson = this._createPaymentJson(props);
        const executePaymentRes = await this._executePaymentTemplate(createPaymentJson);
        return executePaymentRes;
    };
    executeSubscription = async () => {
        return {
            redirectUrl: '',
        };
    };
    executePayout = async (props) => {
        const createPayoutJson = this._createPayoutJson(props);
        const executePayoutRes = await this._executePayoutTemplate(createPayoutJson);
        return executePayoutRes;
    };
    init = async (initParams) => {
        const { paymentLib, ...optionalInitParams } = initParams;
        this._paymentLib = paymentLib;
        await this._initTemplate(optionalInitParams);
        return this;
    };
    _initTemplate = (optionalInitParams) => {
        return;
    };
}
exports.AbstractPaymentService = AbstractPaymentService;
