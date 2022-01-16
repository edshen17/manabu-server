import { IS_PRODUCTION } from '../../../../constants';
import { JoinedUserDoc } from '../../../../models/User';
import { JwtHandler } from '../jwtHandler/jwtHandler';

type CookieData = {
  name: string;
  value: string;
  options: {
    maxAge: number;
    httpOnly: boolean;
    secure: boolean;
  };
};

class CookieHandler {
  private _jwtHandler!: JwtHandler;

  public splitLoginCookies = (user: JoinedUserDoc): CookieData[] => {
    const { _id, role } = user;
    const toTokenObj = {
      _id,
      role,
      teacherData: {
        _id: user.teacherData?._id,
      },
    };
    const token = this._jwtHandler.sign({ toTokenObj, expiresIn: '7d' });
    const tokenArr: string[] = token.split('.');
    const options = this._setCookieOptions();
    const hpCookie = {
      name: 'hp',
      value: `${tokenArr[0]}.${tokenArr[1]}`,
      options,
    };
    const sigCookie = {
      name: 'sig',
      value: `.${tokenArr[2]}`,
      options,
    };
    const loginCookies = [hpCookie, sigCookie];
    return loginCookies;
  };

  private _setCookieOptions = (): CookieData['options'] => {
    const ONE_WEEK_MS = 7 * 24 * 60 * 60 * 1000;
    const cookieOptions = {
      maxAge: ONE_WEEK_MS,
      httpOnly: true,
      secure: true,
    };
    if (!IS_PRODUCTION) {
      cookieOptions.httpOnly = false;
      cookieOptions.secure = false;
    }
    return cookieOptions;
  };

  public init = async (initParams: { makeJwtHandler: Promise<JwtHandler> }): Promise<this> => {
    const { makeJwtHandler } = initParams;
    this._jwtHandler = await makeJwtHandler;
    return this;
  };
}

export { CookieHandler, CookieData };
