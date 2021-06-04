import { IEntity } from '../abstractions/IEntity';

class UserEntity implements IEntity {
  private sanitize: any;
  private inputValidator: any;
  private passwordHasher: any;
  private randTokenGenerator: any;

  constructor(props: any) {
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

  build(userData: any): any | Error {
    let verificationToken: string;
    let { name, email, password, profileImage } = userData;
    try {
      this._validateUserInput(userData);
      return Object.freeze({
        name,
        email,
        password: (password = this.passwordHasher(password)),
        profileImage: profileImage || '',
        verificationToken: (verificationToken = this.randTokenGenerator(name, email)),
      });
    } catch (err) {
      throw err;
    }
  }
}

export { UserEntity };
