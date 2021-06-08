"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeExpressCallback = void 0;
const makeExpressCallback = (makeController) => {
    return async (req, res) => {
        try {
            const httpRequest = {
                body: req.body,
                query: req.query,
                params: req.params,
                ip: req.ip,
                method: req.method,
                path: req.path,
                currentAPIUser: {
                    userId: req.userId,
                    role: req.role || 'user',
                    isVerified: req.isVerified,
                },
                headers: {
                    'Content-Type': req.get('Content-Type'),
                    Referer: req.get('referer'),
                    'User-Agent': req.get('User-Agent'),
                },
            };
            const controller = await makeController;
            const httpResponse = await controller.makeRequest(httpRequest);
            if (httpResponse.headers) {
                res.set(httpResponse.headers);
            }
            res.type('json');
            res.status(httpResponse.statusCode).send(httpResponse.body);
        }
        catch (err) {
            res.status(500).send({ error: 'An unknown error occurred.' });
        }
    };
};
exports.makeExpressCallback = makeExpressCallback;
