import { IController } from '../../controllers/abstractions/IController';
import { IExpressCallback } from './IExpressCallback';
import { IHttpRequest } from './IHttpRequest';
abstract class AbstractExpressCallback implements IExpressCallback {
  public abstract consumeTemplate(res: any, body: any): void;

  public consume = (
    makeController: Promise<IController<any>>
  ): ((req: any, res: any) => Promise<void>) => {
    return async (req: any, res: any): Promise<void> => {
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
        } else {
          this.consumeTemplate(res, body);
        }
      } catch (err: any) {
        res.status(500).send({ err: err.message });
      }
    };
  };

  private _createHttpRequest = (req: any): IHttpRequest => {
    const {
      body,
      query,
      params,
      ip,
      method,
      originalUrl,
      userId,
      role,
      teacherId,
      headers,
      rawBody,
      token,
    } = req;
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

export { AbstractExpressCallback };
