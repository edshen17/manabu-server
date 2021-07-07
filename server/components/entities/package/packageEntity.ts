import { JoinedUserDoc, UserDbService } from '../../dataAccess/services/user/userDbService';
import { AbstractEntity } from '../abstractions/AbstractEntity';
import { IEntityValidator } from '../abstractions/IEntityValidator';

type OptionalPackageEntityInitParams = {
  makeUserDbService: Promise<UserDbService>;
};

type PackageEntityBuildParams = {
  hostedBy: string;
  priceDetails?: PriceDetails;
  lessonAmount: number;
  isOffering?: boolean;
  packageType: string;
  packageDurations?: number[];
};

type PriceDetails = { hourlyPrice: number; currency: string };

type PackageEntityBuildResponse = {
  hostedBy: string;
  priceDetails: PriceDetails;
  lessonAmount: number;
  isOffering: boolean;
  packageType: string;
  packageDurations: number[];
};

class PackageEntity extends AbstractEntity<
  OptionalPackageEntityInitParams,
  PackageEntityBuildParams,
  PackageEntityBuildResponse
> {
  private _userDbService!: UserDbService;

  public build = async (
    buildParams: PackageEntityBuildParams
  ): Promise<PackageEntityBuildResponse> => {
    const packageEntity = await this._buildPackageEntity(buildParams);
    return packageEntity;
  };

  private _buildPackageEntity = async (
    buildParams: PackageEntityBuildParams
  ): Promise<PackageEntityBuildResponse> => {
    const { hostedBy, priceDetails, lessonAmount, isOffering, packageType, packageDurations } =
      buildParams;
    const packageEntity = Object.freeze({
      hostedBy,
      priceDetails: priceDetails || (await this._getPriceDetails(hostedBy)),
      lessonAmount: lessonAmount || 5,
      isOffering: isOffering || true,
      packageType: packageType || 'light',
      packageDurations: packageDurations || [30, 60],
    });
    return packageEntity;
  };

  private _getPriceDetails = async (hostedBy: string) => {
    const savedDbTeacher: JoinedUserDoc = await this.getDbDataById({
      dbService: this._userDbService,
      _id: hostedBy,
    });
    const teacherData = savedDbTeacher.teacherData;
    let priceDetails: PriceDetails;
    if (teacherData) {
      const teacherHourlyRate = savedDbTeacher.teacherData.hourlyRate;
      priceDetails = {
        currency: teacherHourlyRate.currency!,
        hourlyPrice: teacherHourlyRate.amount!,
      };
    } else {
      priceDetails = {
        currency: 'SGD',
        hourlyPrice: 35,
      };
    }
    return priceDetails;
  };

  protected _initTemplate = async (
    partialInitParams: Omit<
      {
        makeEntityValidator: IEntityValidator;
      } & OptionalPackageEntityInitParams,
      'makeEntityValidator'
    >
  ): Promise<void> => {
    const { makeUserDbService } = partialInitParams;
    this._userDbService = await makeUserDbService;
  };
}

export { PackageEntity, PackageEntityBuildResponse, PackageEntityBuildParams };
