"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExpressCallback = void 0;
const AbstractExpressCallback_1 = require("../../abstractions/AbstractExpressCallback");
class ExpressCallback extends AbstractExpressCallback_1.AbstractExpressCallback {
    consumeTemplate = (res, body) => {
        return;
    };
}
exports.ExpressCallback = ExpressCallback;
