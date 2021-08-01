import {
  DbServiceParams,
  DB_SERVICE_CACHE_DEPENDENCY_COLLECTIONS,
} from '../../abstractions/IDbService';
import { AbstractDbService } from '../../abstractions/AbstractDbService';
import { JoinedUserDoc } from '../../../../models/User';

type OptionalUserDbServiceInitParams = {
  comparePassword: any;
};

class UserDbService extends AbstractDbService<OptionalUserDbServiceInitParams, JoinedUserDoc> {
  private _comparePassword!: any;

  protected _getDbServiceModelViews = () => {
    return {
      defaultView: {
        email: 0,
        password: 0,
        verificationToken: 0,
        settings: 0,
        contactMethods: 0,
        isEmailVerified: 0,
        nameNGrams: 0,
        namePrefixNGrams: 0,
        'teacherData.licensePathUrl': 0,
      },
      adminView: {
        password: 0,
        verificationToken: 0,
        nameNGrams: 0,
      },
      selfView: {
        password: 0,
        verificationToken: 0,
        nameNGrams: 0,
      },
      overrideView: {
        verificationToken: 0,
        nameNGrams: 0,
      },
    };
  };

  public authenticateUser = async (
    dbServiceParams: DbServiceParams,
    inputtedPassword: string
  ): Promise<any> => {
    const userData = await this.findOne(dbServiceParams);
    if (!userData) {
      return null;
    }
    if (!userData.password) {
      throw new Error(
        'It seems that you signed up previously through a third-party service like Google.'
      );
    }
    const isPasswordValid = this._comparePassword(inputtedPassword, userData.password);
    if (isPasswordValid) {
      const { password, ...partialuserDataWithoutPassword } = userData;
      return partialuserDataWithoutPassword;
    } else {
      throw new Error('Username or password incorrect.');
    }
  };

  protected _getCacheDependencies = (): string[] => {
    return [
      DB_SERVICE_CACHE_DEPENDENCY_COLLECTIONS.APPOINTMENTS,
      DB_SERVICE_CACHE_DEPENDENCY_COLLECTIONS.PACKAGE_TRANSACTIONS,
      DB_SERVICE_CACHE_DEPENDENCY_COLLECTIONS.MINUTE_BANKS,
    ];
  };

  protected _initTemplate = async (
    optionalDbServiceInitParams: OptionalUserDbServiceInitParams
  ) => {
    const { comparePassword } = optionalDbServiceInitParams;
    this._comparePassword = comparePassword;
  };
}

export { UserDbService };
