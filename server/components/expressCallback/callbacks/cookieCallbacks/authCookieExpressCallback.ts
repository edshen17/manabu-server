import { AbstractExpressCallback } from '../../abstractions/AbstractExpressCallback';

type CookieData = {
  value: string;
  options: {
    maxAge: number;
    httpOnly: boolean;
    secure: boolean;
  };
};

class AuthCookieExpressCallback extends AbstractExpressCallback {
  private _setCookieOptions = (): CookieData['options'] => {
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

  private _splitLoginCookies = (token: string): { hp: CookieData; sig: CookieData } => {
    const tokenArr: string[] = token.split('.');
    const cookies = {
      hp: {
        value: `${tokenArr[0]}.${tokenArr[1]}`,
        options: this._setCookieOptions(),
      },
      sig: {
        value: `.${tokenArr[2]}`,
        options: this._setCookieOptions(),
      },
    };
    return cookies;
  };

  protected _consumeTemplate = (res: any, body: any) => {
    if (body && 'isLoginToken' in body) {
      const { token } = body;
      const loginCookies = this._splitLoginCookies(token);
      const { hp, sig } = loginCookies;
      res.cookie('hp', hp.value, hp.options);
      res.cookie('sig', sig.value, sig.options);
    }
  };
}

export { AuthCookieExpressCallback };
