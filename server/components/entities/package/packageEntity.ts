import { JoinedUserDoc, UserDbService } from '../../dataAccess/services/user/userDbService';
import { AbstractEntityValidator } from '../../validators/abstractions/AbstractEntityValidator';
import { AbstractEntity } from '../abstractions/AbstractEntity';

type OptionalPackageEntityInitParams = {
  makeUserDbService: Promise<UserDbService>;
};

type PackageEntityBuildParams = {
  hostedById: string;
  lessonAmount: number;
  isOffering: boolean;
  packageType: string;
  lessonDurations: number[];
  packageName: string;
};

type PriceData = { hourlyRate: number; currency: string };

type PackageEntityBuildResponse = {
  hostedById: string;
  priceData: PriceData;
  lessonAmount: number;
  isOffering: boolean;
  packageType: string;
  lessonDurations: number[];
};

class PackageEntity extends AbstractEntity<
  OptionalPackageEntityInitParams,
  PackageEntityBuildParams,
  PackageEntityBuildResponse
> {
  private _userDbService!: UserDbService;

  protected _buildTemplate = async (
    buildParams: PackageEntityBuildParams
  ): Promise<PackageEntityBuildResponse> => {
    const { hostedById, lessonAmount, isOffering, packageType, lessonDurations, packageName } =
      buildParams;
    const priceData = await this._getPriceDetails(hostedById);
    const packageEntity = Object.freeze({
      hostedById,
      priceData,
      lessonAmount,
      isOffering,
      packageType,
      packageName,
      lessonDurations,
    });
    return packageEntity;
  };

  private _getPriceDetails = async (hostedById: string) => {
    const savedDbTeacher: JoinedUserDoc = await this.getDbDataById({
      dbService: this._userDbService,
      _id: hostedById,
    });
    const teacherData = savedDbTeacher.teacherData;
    let priceData: PriceData;
    if (teacherData) {
      const teacherPriceData = savedDbTeacher.teacherData.priceData;
      priceData = {
        currency: teacherPriceData.currency!,
        hourlyRate: teacherPriceData.hourlyRate!,
      };
    } else {
      priceData = {
        currency: 'SGD',
        hourlyRate: 35,
      };
    }
    return priceData;
  };

  protected _initTemplate = async (
    optionalInitParams: Omit<
      {
        makeEntityValidator: AbstractEntityValidator;
      } & OptionalPackageEntityInitParams,
      'makeEntityValidator'
    >
  ): Promise<void> => {
    const { makeUserDbService } = optionalInitParams;
    this._userDbService = await makeUserDbService;
  };
}

export { PackageEntity, PackageEntityBuildResponse, PackageEntityBuildParams };
