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
  private sanitize: any;
  private inputValidator: any;
  private passwordHasher: any;
  private randTokenGenerator: any;

  constructor(props: {
    sanitize: any;
    inputValidator: any;
    passwordHasher: any;
    randTokenGenerator: any;
  }) {
    super();
    const { sanitize, inputValidator, passwordHasher, randTokenGenerator } = props;
    this.sanitize = sanitize;
    this.inputValidator = inputValidator;
    this.passwordHasher = passwordHasher;
    this.randTokenGenerator = randTokenGenerator;
  }

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

  private _setPassword = (password?: string) => {
    if (password) {
      return this.passwordHasher(password);
    } else {
      return undefined;
    }
  };

  build(entityData: {
    name: string;
    email: string;
    password?: string;
    profileImage?: string;
  }): UserEntityResponse {
    let verificationToken: string;
    let { name, email, password, profileImage } = entityData;
    try {
      this._validateUserInput(entityData);
      return Object.freeze({
        name,
        email,
        password: this._setPassword(password),
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
        verificationToken: (verificationToken = this.randTokenGenerator(name, email)),
      });
    } catch (err) {
      throw err;
    }
  }
}

export { UserEntity, UserEntityResponse };
