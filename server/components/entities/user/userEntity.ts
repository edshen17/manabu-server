import { AbstractEntity } from '../abstractions/AbstractEntity';

type UserEntityInitParams = {
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

type UserEntityBuildResponse =
  | {
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
    }
  | Error;

class UserEntity extends AbstractEntity<
  UserEntityInitParams,
  UserEntityBuildParams,
  UserEntityBuildResponse
> {
  private _hashPassword!: any;
  private _cryptoRandomString!: any;
  private _signJwt!: any;

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
    const { name, email, password, profileImageUrl } = entityBuildParams;
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
    const { name, email, password, profileImageUrl, contactMethods } = entityBuildParams || {};
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

  public init = (entityInitParams: UserEntityInitParams) => {
    const { hashPassword, cryptoRandomString, signJwt } = entityInitParams;
    this._hashPassword = hashPassword;
    this._cryptoRandomString = cryptoRandomString;
    this._signJwt = signJwt;
    return this;
  };
}

export { UserEntity, UserEntityBuildParams, UserEntityBuildResponse, UserContactMethod };
