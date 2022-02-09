"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CookieCallbackDecorator = void 0;
const AbstractExpressCallback_1 = require("../../abstractions/AbstractExpressCallback");
class CookieCallbackDecorator extends AbstractExpressCallback_1.AbstractExpressCallback {
    abstractExpressCallback;
    constructor(abstractExpressCallback) {
        super();
        this.abstractExpressCallback = abstractExpressCallback;
    }
    consumeTemplate = (res, body) => {
        if (body && body.cookies) {
            const { cookies } = body;
            for (const cookie of cookies) {
                const { name, value, options } = cookie;
                res.cookie(name, value, options);
            }
            this.abstractExpressCallback.consumeTemplate(res, body);
        }
    };
}
exports.CookieCallbackDecorator = CookieCallbackDecorator;
