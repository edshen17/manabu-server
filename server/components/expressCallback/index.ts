import { Request, Response } from 'express';
export interface IHttpRequest {
  body: Request['body'];
  path: Request['path'];
  query: Request['query'];
  params: Request['params'];
  currentAPIUser: {
    userId: Request['userId'];
    role: Request['role'];
    isVerified: Request['isVerified'];
  };
}

export const makeExpressCallback = (controller: Controller) => {
  return async (req: Request, res: Response): Promise<void> => {
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
          role: req.role,
          isVerified: req.isVerified,
        },
        headers: {
          'Content-Type': req.get('Content-Type'),
          Referer: req.get('referer'),
          'User-Agent': req.get('User-Agent'),
        },
      };
      const httpResponse: IControllerResponse = await controller(httpRequest);
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
