import { AbstractEntity } from '../abstractions/AbstractEntity';

type UserEntityInitParams = {
  sanitizeHtml: any;
  bcrypt: any;
  cryptoRandomString: any;
  jwt: any;
};

type UserEntityBuildParams = {
  name: string;
  email: string;
  password?: string;
  profileImage?: string;
  commMethods?: { method: string; id: string }[];
};

type UserEntityBuildResponse =
  | {
      name: string;
      email: string;
      password?: string;
      profileImage: string;
      profileBio: string;
      dateRegistered: Date;
      lastUpdated: Date;
      languages?: { level: string; language: string }[];
      region: string;
      timezone: string;
      lastOnline: Date;
      role: string;
      settings: { currency: string };
      membership: string[];
      commMethods: { method: string; id: string }[];
      emailVerified: boolean;
      verificationToken: string;
    }
  | Error;

class UserEntity extends AbstractEntity<
  UserEntityInitParams,
  UserEntityBuildParams,
  UserEntityBuildResponse
> {
  private _sanitizeHtml!: any;
  private _bcrypt!: any;
  private _cryptoRandomString!: any;
  private _jwt!: any;

  public build = (entityBuildParams: UserEntityBuildParams): UserEntityBuildResponse => {
    try {
      this._validateUserInput(entityBuildParams);
      const userEntity = this._buildUserEntity(entityBuildParams);
      return userEntity;
    } catch (err) {
      throw err;
    }
  };

  private _validateUserInput = (entityBuildParams: UserEntityBuildParams): void => {
    const { name, email, password, profileImage } = entityBuildParams;
    const inputValidator = this._makeInputValidator();
    if (!inputValidator.isValidName(name)) {
      throw new Error('User must have a valid name.');
    }

    if (!inputValidator.isValidEmail(email)) {
      throw new Error('User must have a valid email.');
    }

    if (!inputValidator.isValidPassword(password)) {
      throw new Error('User must have a valid password.');
    }
  };

  private _makeInputValidator = () => {
    const inputValidator = {
      // TODO: Finish all validations & sanitize
      isValidName: (name: string) => {
        return true;
      },
      isValidEmail: (email: string) => {
        return true;
      },
      isValidPassword: (password?: string) => {
        return true;
      },
      isValidURL: (url: string) => {
        return true;
      },
    };
    return inputValidator;
  };

  private _buildUserEntity = (
    entityBuildParams: UserEntityBuildParams
  ): UserEntityBuildResponse => {
    const { name, email, password, profileImage, commMethods } = entityBuildParams || {};
    const userEntity = Object.freeze({
      name,
      email,
      password: this._encryptPassword(password),
      profileImage: profileImage || '',
      profileBio: '',
      dateRegistered: new Date(),
      lastUpdated: new Date(),
      languages: [],
      region: '',
      timezone: '',
      lastOnline: new Date(),
      role: 'user',
      settings: { currency: 'SGD' },
      membership: [],
      commMethods: commMethods || [],
      emailVerified: false,
      verificationToken: this._generateVerificationToken(name, email),
    });
    return userEntity;
  };

  private _encryptPassword = (password?: string): string | undefined => {
    if (password) {
      return this._bcrypt.hashSync(password, 10);
    } else {
      return undefined;
    }
  };

  private _generateVerificationToken = (name: string, email: string): string => {
    const randToken = this._cryptoRandomString({ length: 15 });
    const secret = process.env.JWT_SECRET!;
    const verificationToken = this._jwt.sign({ randToken, name, email }, secret, {
      expiresIn: 24 * 60 * 60 * 7,
    });

    return verificationToken;
  };

  public init = (entityInitParams: UserEntityInitParams) => {
    const { sanitizeHtml, bcrypt, cryptoRandomString, jwt } = entityInitParams;
    this._sanitizeHtml = sanitizeHtml;
    this._bcrypt = bcrypt;
    this._cryptoRandomString = cryptoRandomString;
    this._jwt = jwt;
    return this;
  };
}

export { UserEntity, UserEntityBuildParams, UserEntityBuildResponse };
