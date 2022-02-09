"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaypalPaymentService = void 0;
const AbstractPaymentService_1 = require("../../abstractions/AbstractPaymentService");
const IPaymentService_1 = require("../../abstractions/IPaymentService");
class PaypalPaymentService extends AbstractPaymentService_1.AbstractPaymentService {
    _createPaymentJson = (props) => {
        const { successRedirectUrl, cancelRedirectUrl, items, currency, description, total, token } = props;
        const createPaymentJson = {
            intent: 'sale',
            payer: {
                payment_method: IPaymentService_1.PAYMENT_GATEWAY_NAME.PAYPAL,
            },
            redirect_urls: {
                return_url: successRedirectUrl,
                cancel_url: cancelRedirectUrl,
            },
            transactions: [
                {
                    item_list: {
                        items,
                    },
                    amount: {
                        currency: currency,
                        total: total,
                    },
                    description,
                    custom: token,
                },
            ],
        };
        return createPaymentJson;
    };
    _executePaymentTemplate = async (createPaymentJson) => {
        return new Promise((resolve, reject) => {
            this._paymentLib.payment.create(createPaymentJson, (err, payment) => {
                if (err) {
                    reject(err);
                }
                const redirectUrl = payment.links.filter((link) => {
                    return link.rel == 'approval_url';
                })[0].href;
                const executePaymentRes = { redirectUrl };
                resolve(executePaymentRes);
            });
        });
    };
    _createPayoutJson = (props) => {
        const { type, emailData, id, recipients } = props;
        const { subject, message } = emailData;
        const createPayoutJson = {
            sender_batch_header: {
                recipient_type: type.toUpperCase(),
                email_message: message,
                note: message,
                sender_batch_id: id,
                email_subject: subject,
            },
            items: recipients,
        };
        return createPayoutJson;
    };
    _executePayoutTemplate = (createPayoutJson) => {
        return new Promise((resolve, reject) => {
            this._paymentLib.payout.create(createPayoutJson, (err, payout) => {
                if (err) {
                    reject(err);
                }
                const { batch_header } = payout;
                const { payout_batch_id } = batch_header;
                const executePayoutRes = { id: payout_batch_id };
                resolve(executePayoutRes);
            });
        });
    };
}
exports.PaypalPaymentService = PaypalPaymentService;
