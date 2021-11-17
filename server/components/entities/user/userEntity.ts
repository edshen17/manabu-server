import { JWT_SECRET } from '../../../constants';
import { UserContactMethodEmbed } from '../../../models/User';
import {
  ENTITY_VALIDATOR_VALIDATE_MODES,
  ENTITY_VALIDATOR_VALIDATE_USER_ROLES,
} from '../../validators/abstractions/AbstractEntityValidator';
import { PackageEntityValidator } from '../../validators/package/entity/packageEntityValidator';
import { TeacherEntityValidator } from '../../validators/teacher/entity/teacherEntityValidator';
import { AbstractEntity } from '../abstractions/AbstractEntity';
import { TeacherEntityBuildResponse } from '../teacher/teacherEntity';
import { NGramHandler } from '../utils/nGramHandler/nGramHandler';

type OptionalUserEntityInitParams = {
  hashPassword: any;
  cryptoRandomString: any;
  signJwt: any;
  makeTeacherEntityValidator: TeacherEntityValidator;
  makePackageEntityValidator: PackageEntityValidator;
  makeNGramHandler: NGramHandler;
};

type UserEntityBuildParams = {
  name: string;
  email: string;
  password?: string;
  profileImageUrl?: string;
  contactMethods?: UserContactMethod[] | [];
  teacherData?: TeacherEntityBuildResponse;
};

type UserContactMethod = typeof UserContactMethodEmbed;

type UserEntityBuildResponse = {
  name: string;
  email: string;
  password?: string;
  profileImageUrl: string;
  profileBio: string;
  creationDate: Date;
  languages?: { level: string; language: string }[];
  region: string;
  timezone: string;
  lastOnlineDate: Date;
  role: string;
  settings: {
    currency: string;
    locale: string;
    emailAlerts: {
      appointmentCreation: boolean;
      appointmentUpdate: boolean;
      appointmentStartReminder: boolean;
    };
  };
  memberships: string[];
  contactMethods: UserContactMethod[] | [];
  isEmailVerified: boolean;
  verificationToken: string;
  lastModifiedDate: Date;
  nameNGrams: string;
  namePrefixNGrams: string;
  balance: {
    totalCurrent: number;
    totalPending: number;
    totalAvailable: number;
    currency: string;
  };
  teacherData?: TeacherEntityBuildResponse;
};

class UserEntity extends AbstractEntity<
  OptionalUserEntityInitParams,
  UserEntityBuildParams,
  UserEntityBuildResponse
> {
  private _hashPassword!: any;
  private _cryptoRandomString!: any;
  private _signJwt!: any;
  private _teacherEntityValidator!: TeacherEntityValidator;
  private _packageEntityValidator!: PackageEntityValidator;
  private _nGramHandler!: NGramHandler;

  protected _validate = (buildParams: UserEntityBuildParams) => {
    const { teacherData, ...userData } = buildParams;
    this._entityValidator.validate({
      buildParams: userData,
      userRole: ENTITY_VALIDATOR_VALIDATE_USER_ROLES.USER,
      validationMode: ENTITY_VALIDATOR_VALIDATE_MODES.CREATE,
    });
    if (teacherData) {
      const { packages, ...toValidateTeacherData } = teacherData;
      this._teacherEntityValidator.validate({
        buildParams: toValidateTeacherData,
        userRole: ENTITY_VALIDATOR_VALIDATE_USER_ROLES.USER,
        validationMode: ENTITY_VALIDATOR_VALIDATE_MODES.CREATE,
      });
      packages.map((pkg) => {
        this._packageEntityValidator.validate({
          buildParams: pkg,
          userRole: ENTITY_VALIDATOR_VALIDATE_USER_ROLES.USER,
          validationMode: ENTITY_VALIDATOR_VALIDATE_MODES.CREATE,
        });
      });
    }
  };

  protected _buildTemplate = (buildParams: UserEntityBuildParams): UserEntityBuildResponse => {
    const { name, email, password, profileImageUrl, contactMethods, teacherData } =
      buildParams || {};
    const encryptedPassword = this._encryptPassword(password);
    const verificationToken = this._createVerificationToken(name, email);
    const userEntity = {
      name,
      email,
      password: encryptedPassword,
      profileImageUrl: profileImageUrl || `https://avatars.dicebear.com/api/initials/${name}.svg`,
      profileBio: '',
      creationDate: new Date(),
      languages: [],
      region: '',
      timezone: '',
      lastOnlineDate: new Date(),
      role: 'user',
      settings: {
        currency: 'SGD',
        locale: 'en',
        emailAlerts: {
          appointmentCreation: true,
          appointmentUpdate: true,
          appointmentStartReminder: true,
        },
      },
      memberships: [],
      contactMethods: contactMethods || [],
      isEmailVerified: false,
      verificationToken,
      lastModifiedDate: new Date(),
      teacherData,
      nameNGrams: this._nGramHandler.createEdgeNGrams({ str: name, isPrefixOnly: false }),
      namePrefixNGrams: this._nGramHandler.createEdgeNGrams({ str: name, isPrefixOnly: true }),
      balance: {
        totalCurrent: 0,
        totalPending: 0,
        totalAvailable: 0,
        currency: 'SGD',
      },
    };
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
    const secret = JWT_SECRET;
    const TOKEN_EXPIRY_DATE = 24 * 60 * 60 * 7;
    const verificationToken = this._signJwt({ randToken, name, email }, secret, {
      expiresIn: TOKEN_EXPIRY_DATE,
    });

    return verificationToken;
  };

  protected _initTemplate = async (
    optionalInitParams: OptionalUserEntityInitParams
  ): Promise<void> => {
    const {
      hashPassword,
      signJwt,
      cryptoRandomString,
      makeTeacherEntityValidator,
      makePackageEntityValidator,
      makeNGramHandler,
    } = optionalInitParams;
    this._hashPassword = hashPassword;
    this._signJwt = signJwt;
    this._cryptoRandomString = cryptoRandomString;
    this._teacherEntityValidator = makeTeacherEntityValidator;
    this._packageEntityValidator = makePackageEntityValidator;
    this._nGramHandler = makeNGramHandler;
  };
}

export { UserEntity, UserEntityBuildParams, UserEntityBuildResponse, UserContactMethod };
