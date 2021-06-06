import { AbstractEntity } from '../abstractions/AbstractEntity';
import { IEntity } from '../abstractions/IEntity';

class UserEntity extends AbstractEntity implements IEntity {
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
  }): any | Error {
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

export { UserEntity };
