import { AbstractEntity } from '../abstractions/AbstractEntity';
import { IEntityValidator } from '../abstractions/IEntityValidator';

type OptionalUserEntityInitParams = {
  hashPassword: any;
  cryptoRandomString: any;
  signJwt: any;
};

type UserEntityBuildParams = {
  name: string;
  email: string;
  password?: string;
  profileImageUrl?: string;
  contactMethods?: UserContactMethod[] | [];
};

type UserContactMethod = {
  methodName: string;
  methodId: string;
  isPrimaryMethod: boolean;
  methodType: string;
};

type UserEntityBuildResponse = {
  name: string;
  email: string;
  password?: string;
  profileImageUrl: string;
  profileBio: string;
  dateRegistered: Date;
  languages?: { level: string; language: string }[];
  region: string;
  timezone: string;
  lastOnline: Date;
  role: string;
  settings: { currency: string };
  memberships: string[];
  contactMethods: UserContactMethod[] | [];
  isEmailVerified: boolean;
  verificationToken: string;
};

class UserEntity extends AbstractEntity<
  OptionalUserEntityInitParams,
  UserEntityBuildParams,
  UserEntityBuildResponse
> {
  private _hashPassword!: any;
  private _cryptoRandomString!: any;
  private _signJwt!: any;

  public build = (buildParams: UserEntityBuildParams): UserEntityBuildResponse => {
    // this._entityValidator.validate({ buildParams, userRole: 'user', validationMode: 'create' });
    const userEntity = this._buildUserEntity(buildParams);
    return userEntity;
  };

  private _buildUserEntity = (buildParams: UserEntityBuildParams): UserEntityBuildResponse => {
    const { name, email, password, profileImageUrl, contactMethods } = buildParams || {};
    const encryptedPassword = this._encryptPassword(password);
    const verificationToken = this._createVerificationToken(name, email);
    const userEntity = Object.freeze({
      name,
      email,
      password: encryptedPassword,
      profileImageUrl: profileImageUrl || '',
      profileBio: '',
      dateRegistered: new Date(),
      languages: [],
      region: '',
      timezone: '',
      lastOnline: new Date(),
      role: 'user',
      settings: { currency: 'SGD' },
      memberships: [],
      contactMethods: contactMethods || [],
      isEmailVerified: false,
      verificationToken,
    });
    return userEntity;
  };

  private _encryptPassword = (password?: string): string | undefined => {
    if (password) {
      return this._hashPassword(password, 10);
    } else {
      return undefined;
    }
  };

  private _createVerificationToken = (name: string, email: string): string => {
    const randToken = this._cryptoRandomString({ length: 15 });
    const secret = process.env.JWT_SECRET;
    const TOKEN_EXPIRY_DATE = 24 * 60 * 60 * 7;
    const verificationToken = this._signJwt({ randToken, name, email }, secret, {
      expiresIn: TOKEN_EXPIRY_DATE,
    });

    return verificationToken;
  };

  protected _initTemplate = async (
    partialInitParams: Omit<
      {
        makeEntityValidator: IEntityValidator;
      } & OptionalUserEntityInitParams,
      'makeEntityValidator'
    >
  ): Promise<void> => {
    const { hashPassword, signJwt, cryptoRandomString } = partialInitParams;
    this._hashPassword = hashPassword;
    this._signJwt = signJwt;
    this._cryptoRandomString = cryptoRandomString;
  };
}

export { UserEntity, UserEntityBuildParams, UserEntityBuildResponse, UserContactMethod };
