"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AbstractExpressCallback = void 0;
class AbstractExpressCallback {
    consume = (makeController) => {
        return async (req, res) => {
            try {
                const httpRequest = this._createHttpRequest(req);
                const controller = await makeController;
                const httpResponse = await controller.makeRequest(httpRequest);
                const { headers, statusCode, body } = httpResponse;
                if (headers) {
                    res.set(headers);
                }
                res.status(statusCode);
                if (body.err) {
                    res.json(body);
                }
                else {
                    this.consumeTemplate(res, body);
                }
            }
            catch (err) {
                res.status(500).send({ err: err.message });
            }
        };
    };
    _createHttpRequest = (req) => {
        const { body, query, params, ip, method, originalUrl, userId, role, teacherId, headers, rawBody, token, } = req;
        const httpRequest = {
            body,
            rawBody,
            query,
            params,
            ip,
            method,
            path: originalUrl,
            currentAPIUser: {
                userId,
                role: role || 'user',
                teacherId: teacherId,
                token,
            },
            headers,
        };
        return httpRequest;
    };
}
exports.AbstractExpressCallback = AbstractExpressCallback;
