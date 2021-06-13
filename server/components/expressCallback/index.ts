import { Request } from 'express';
import { IController } from '../controllers/abstractions/IController';
export interface IHttpRequest {
  body: Request['body'];
  path: Request['path'];
  query: Request['query'];
  params: Request['params'];
  currentAPIUser: {
    userId?: string;
    role: string;
  };
}

const _createHttpRequest = (req: any) => {
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

type CookieData = {
  value: string;
  options: {
    maxAge: number;
    httpOnly: boolean;
    secure: boolean;
  };
};

const _setCookieOptions = () => {
  const cookieOptions = {
    maxAge: 2 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    secure: true,
  };

  if (process.env.NODE_ENV != 'production') {
    cookieOptions.httpOnly = false;
    cookieOptions.secure = false;
  }

  return cookieOptions;
};

const _splitLoginCookies = (token: string): { hp: CookieData; sig: CookieData } => {
  const tokenArr: string[] = token.split('.');
  const cookies = {
    hp: {
      value: `${tokenArr[0]}.${tokenArr[1]}`,
      options: _setCookieOptions(),
    },
    sig: {
      value: `.${tokenArr[2]}`,
      options: _setCookieOptions(),
    },
  };
  return cookies;
};

export const makeExpressCallback = (makeController: Promise<IController<any>>) => {
  return async (req: any, res: any): Promise<void> => {
    try {
      const httpRequest = _createHttpRequest(req);
      const controller = await makeController;
      const httpResponse = await controller.makeRequest(httpRequest);
      const { headers, statusCode, body } = httpResponse;
      const { token, user, isLoginToken } = body;
      if (headers) {
        res.set(headers);
      }
      res.type('json');
      if (token && user && isLoginToken) {
        const loginCookies = _splitLoginCookies(token);
        const { hp, sig } = loginCookies;
        res.cookie('hp', hp.value, hp.options);
        res.cookie('sig', sig.value, sig.options);
      }
      res.status(statusCode).send(body);
    } catch (err) {
      res.status(500).send({ err: err.message });
    }
  };
};
