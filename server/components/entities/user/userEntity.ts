import { AbstractEntity } from '../abstractions/AbstractEntity';
import { IEntity } from '../abstractions/IEntity';

type UserEntityData = {
  name: string;
  email: string;
  password?: string;
  profileImage?: string;
};

type UserEntityResponse =
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

class UserEntity extends AbstractEntity<UserEntityResponse> implements IEntity<UserEntityResponse> {
  private _sanitize!: any;
  private _inputValidator!: any;
  private _passwordHasher!: any;
  private _randTokenGenerator!: any;

  public build = (userEntityData: UserEntityData): UserEntityResponse => {
    try {
      this._validateUserInput(userEntityData);
      const newUserEntity = this._buildUserEntity(userEntityData);
      return newUserEntity;
    } catch (err) {
      throw err;
    }
  };

  private _validateUserInput = (userEntityData: UserEntityData): void => {
    const { name, email, password, profileImage } = userEntityData;
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

  private _buildUserEntity = (userEntityData: UserEntityData): UserEntityResponse => {
    const { name, email, password, profileImage } = userEntityData || {};
    return Object.freeze({
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
      commMethods: [],
      emailVerified: false,
      verificationToken: this._generateVerificationToken(name, email),
    });
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

  public init = (props: {
    sanitize: any;
    inputValidator: any;
    passwordHasher: any;
    randTokenGenerator: any;
  }) => {
    const { sanitize, inputValidator, passwordHasher, randTokenGenerator } = props;
    this._sanitize = sanitize;
    this._inputValidator = inputValidator;
    this._passwordHasher = passwordHasher;
    this._randTokenGenerator = randTokenGenerator;
    return this;
  };
}

export { UserEntity, UserEntityResponse };
