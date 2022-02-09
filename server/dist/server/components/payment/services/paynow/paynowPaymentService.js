"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaynowPaymentService = void 0;
const AbstractPaymentService_1 = require("../../abstractions/AbstractPaymentService");
class PaynowPaymentService extends AbstractPaymentService_1.AbstractPaymentService {
    _createPaymentJson = (props) => {
        const createPaymentJson = props;
        return createPaymentJson;
    };
    _executePaymentTemplate = async (createPaymentJson) => {
        const { items, token } = createPaymentJson;
        const { source, charge } = items;
        const sourceRes = await this._paymentLib.sources.create(source);
        const { id, amount, currency } = sourceRes;
        const chargeRes = await this._paymentLib.charges.create({
            ...charge,
            source: id,
            amount: amount,
            currency: currency,
            metadata: {
                token,
            },
        });
        const executePaymentRes = {
            redirectUrl: chargeRes.source.scannable_code.image.download_uri,
        };
        return executePaymentRes;
    };
    _createPayoutJson = (props) => {
        return {};
    };
    _executePayoutTemplate = async (createPayoutJson) => {
        return {
            id: '',
        };
    };
}
exports.PaynowPaymentService = PaynowPaymentService;
