import { AbstractEntity } from '../abstractions/AbstractEntity';
import { IEntity } from '../abstractions/IEntity';

type UserEntityResponse =
  | {
      name: string;
      email: string;
      password: string;
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
  private sanitize!: any;
  private inputValidator!: any;
  private passwordHasher!: any;
  private randTokenGenerator!: any;

  public build = (entityData: {
    name: string;
    email: string;
    password?: string;
    profileImage?: string;
  }): UserEntityResponse => {
    try {
      this._validateUserInput(entityData);
      const newUserEntity = this._buildUserEntity(entityData);
      return newUserEntity;
    } catch (err) {
      throw err;
    }
  };

  private _validateUserInput = (userData: any): void => {
    const { name, email, password, profileImage } = userData;
    if (!this.inputValidator.isValidName(name)) {
      throw new Error('User must have a valid name.');
    }

    if (!this.inputValidator.isValidEmail(email)) {
      throw new Error('User must have a valid email.');
    }

    if (!this.inputValidator.isValidPassword(password)) {
      throw new Error('User must have a valid password.');
    }
  };

  private _buildUserEntity = (entityData: {
    name: string;
    email: string;
    password?: string;
    profileImage?: string;
  }): UserEntityResponse => {
    let { name, email, password, profileImage } = entityData;
    const USER_ENTITY_DEFAULT_OPTIONAL_VALUES = this._USER_ENTITY_DEFAULT_OPTIONAL_VALUES();
    const USER_ENTITY_DEFAULT_REQUIRED_VALUES = this._USER_ENTITY_DEFAULT_REQUIRED_VALUES();
    const verificationToken = this._generateVerificationToken(name, email);

    return Object.freeze({
      name,
      email,
      password: this._encryptPassword(password),
      profileImage: profileImage || USER_ENTITY_DEFAULT_OPTIONAL_VALUES.profileImage,
      verificationToken,
      ...USER_ENTITY_DEFAULT_REQUIRED_VALUES,
    });
  };

  private _USER_ENTITY_DEFAULT_OPTIONAL_VALUES = () => {
    return Object.freeze({
      profileImage: '',
    });
  };

  private _USER_ENTITY_DEFAULT_REQUIRED_VALUES = () => {
    return Object.freeze({
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
    });
  };

  private _encryptPassword = (password?: string) => {
    if (password) {
      return this.passwordHasher(password);
    } else {
      return undefined;
    }
  };

  private _generateVerificationToken = (name: string, email: string) => {
    return this.randTokenGenerator(name, email);
  };

  public init = (props: {
    sanitize: any;
    inputValidator: any;
    passwordHasher: any;
    randTokenGenerator: any;
  }) => {
    const { sanitize, inputValidator, passwordHasher, randTokenGenerator } = props;
    this.sanitize = sanitize;
    this.inputValidator = inputValidator;
    this.passwordHasher = passwordHasher;
    this.randTokenGenerator = randTokenGenerator;
    return this;
  };
}

export { UserEntity, UserEntityResponse };
