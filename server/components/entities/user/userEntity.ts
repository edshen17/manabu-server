import { AbstractEntity } from '../abstractions/AbstractEntity';

type UserEntityInitParams = {
  sanitize: any;
  inputValidator: any;
  passwordHasher: any;
  randTokenGenerator: any;
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
  private _sanitize!: any;
  private _inputValidator!: any;
  private _passwordHasher!: any;
  private _randTokenGenerator!: any;

  public build = (entityParams: UserEntityBuildParams): UserEntityBuildResponse => {
    try {
      this._validateUserInput(entityParams);
      const userEntity = this._buildUserEntity(entityParams);
      return userEntity;
    } catch (err) {
      throw err;
    }
  };

  private _validateUserInput = (entityParams: UserEntityBuildParams): void => {
    const { name, email, password, profileImage } = entityParams;
    if (!this._inputValidator.isValidName(name)) {
      throw new Error('User must have a valid name.');
    }

    if (!this._inputValidator.isValidEmail(email)) {
      throw new Error('User must have a valid email.');
    }

    if (!this._inputValidator.isValidPassword(password)) {
      throw new Error('User must have a valid password.');
    }
  };

  private _buildUserEntity = (entityParams: UserEntityBuildParams): UserEntityBuildResponse => {
    const { name, email, password, profileImage, commMethods } = entityParams || {};
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
      return this._passwordHasher(password);
    } else {
      return undefined;
    }
  };

  private _generateVerificationToken = (name: string, email: string): string => {
    return this._randTokenGenerator(name, email);
  };

  public init = (initParams: UserEntityInitParams) => {
    const { sanitize, inputValidator, passwordHasher, randTokenGenerator } = initParams;
    this._sanitize = sanitize;
    this._inputValidator = inputValidator;
    this._passwordHasher = passwordHasher;
    this._randTokenGenerator = randTokenGenerator;
    return this;
  };
}

export { UserEntity, UserEntityBuildParams, UserEntityBuildResponse };
