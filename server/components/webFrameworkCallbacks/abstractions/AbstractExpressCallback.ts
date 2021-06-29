import { IController } from '../../controllers/abstractions/IController';
import { IExpressCallback } from './IExpressCallback';
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
      } catch (err) {
        res.status(500).send({ err: err.message });
      }
    };
  };

  private _createHttpRequest = (req: any) => {
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
      },
      headers: {
        'Content-Type': req.get('Content-Type'),
        Referer: req.get('referer'),
        'User-Agent': req.get('User-Agent'),
      },
    };
    return httpRequest;
  };
}

export { AbstractExpressCallback };
