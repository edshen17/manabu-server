import { StringKeyObject } from '../../../../types/custom';

class JwtHandler {
  private _jwt!: any;
  private _secret: string = process.env.JWT_SECRET!;

  public sign = (props: { toTokenObj: StringKeyObject; expiresIn: string | number }): string => {
    const { toTokenObj, expiresIn } = props;
    const token = this._jwt.sign(toTokenObj, this._secret, {
      expiresIn,
    });
    return token;
  };

  public verify = (token: string): any => {
    const decodedToken = this._jwt.verify(token, this._secret);
    return decodedToken;
  };

  public init = (initParams: { jwt: any }): this => {
    const { jwt } = initParams;
    this._jwt = jwt;
    return this;
  };
}

export { JwtHandler };
