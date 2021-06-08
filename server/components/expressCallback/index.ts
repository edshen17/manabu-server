import { Request, Response } from 'express';
import { IController } from '../controllers/abstractions/IController';
export interface IHttpRequest {
  body: Request['body'];
  path: Request['path'];
  query: Request['query'];
  params: Request['params'];
  currentAPIUser: {
    userId?: string;
    role: string;
    isVerified: boolean;
  };
}

export const makeExpressCallback = (makeController: Promise<IController>) => {
  return async (req: any, res: any): Promise<void> => {
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
    } catch (err) {
      res.status(500).send({ error: 'An unknown error occurred.' });
    }
  };
};
