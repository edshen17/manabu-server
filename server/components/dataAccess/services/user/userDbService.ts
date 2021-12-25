import { JoinedUserDoc } from '../../../../models/User';
import { StringKeyObject } from '../../../../types/custom';
import { AbstractDbService } from '../../abstractions/AbstractDbService';
import { DB_SERVICE_COLLECTIONS } from '../../abstractions/IDbService';

type OptionalUserDbServiceInitParams = {
  comparePassword: any;
};

type UserDbServiceResponse = JoinedUserDoc;

class UserDbService extends AbstractDbService<
  OptionalUserDbServiceInitParams,
  UserDbServiceResponse
> {
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
        balance: 0,
        'teacherData.licenseUrl': 0,
        'teacherData.settings': 0,
      },
      adminView: {
        password: 0,
        verificationToken: 0,
        nameNGrams: 0,
        namePrefixNGrams: 0,
      },
      selfView: {
        password: 0,
        verificationToken: 0,
        nameNGrams: 0,
        namePrefixNGrams: 0,
      },
      overrideView: {},
    };
  };

  public authenticateUser = async (props: {
    searchQuery: StringKeyObject;
    password: string;
  }): Promise<JoinedUserDoc | undefined> => {
    const { searchQuery, password } = props;
    const overrideUser = await this.findOne({
      searchQuery,
      dbServiceAccessOptions: this.getOverrideDbServiceAccessOptions(),
    });
    if (!overrideUser) {
      return undefined;
    }
    if (!overrideUser.password) {
      throw new Error(
        'It seems that you signed up previously through a third-party service like Google.'
      );
    }
    const isPasswordValid = this._comparePassword(password, overrideUser.password);
    if (isPasswordValid) {
      const user = await this.findOne({
        searchQuery,
        dbServiceAccessOptions: this.getSelfDbServiceAccessOptions(),
      });
      return user;
    } else {
      throw new Error('Username or password incorrect.');
    }
  };

  protected _getCacheDependencies = (): string[] => {
    return [DB_SERVICE_COLLECTIONS.APPOINTMENTS, DB_SERVICE_COLLECTIONS.PACKAGE_TRANSACTIONS];
  };

  protected _initTemplate = async (
    optionalDbServiceInitParams: OptionalUserDbServiceInitParams
  ) => {
    const { comparePassword } = optionalDbServiceInitParams;
    this._comparePassword = comparePassword;
  };
}

export { UserDbService, UserDbServiceResponse };
