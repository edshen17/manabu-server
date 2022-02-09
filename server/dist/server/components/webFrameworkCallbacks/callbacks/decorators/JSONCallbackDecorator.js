"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JSONCallbackDecorator = void 0;
const AbstractExpressCallback_1 = require("../../abstractions/AbstractExpressCallback");
class JSONCallbackDecorator extends AbstractExpressCallback_1.AbstractExpressCallback {
    abstractExpressCallback;
    constructor(abstractExpressCallback) {
        super();
        this.abstractExpressCallback = abstractExpressCallback;
    }
    consumeTemplate = (res, body) => {
        this.abstractExpressCallback.consumeTemplate(res, body);
        const { cookies, ...filteredBody } = body;
        res.json(filteredBody);
    };
}
exports.JSONCallbackDecorator = JSONCallbackDecorator;
