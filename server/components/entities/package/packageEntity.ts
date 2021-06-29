import { JoinedUserDoc, UserDbService } from '../../dataAccess/services/user/userDbService';
import { AbstractEntity } from '../abstractions/AbstractEntity';

type PackageEntityInitParams = {
  makeUserDbService: Promise<UserDbService>;
};

type PackageEntityBuildParams = {
  hostedBy: string;
  priceDetails?: { hourlyPrice: number; currency: string };
  lessonAmount: number;
  isOffering?: boolean;
  packageType: string;
  packageDurations?: number[];
};

type PackageEntityBuildResponse = {
  hostedBy: string;
  priceDetails: { hourlyPrice: number; currency: string };
  lessonAmount: number;
  isOffering: boolean;
  packageType: string;
  packageDurations: number[];
};

class PackageEntity extends AbstractEntity<
  PackageEntityInitParams,
  PackageEntityBuildParams,
  PackageEntityBuildResponse
> {
  private _userDbService!: UserDbService;

  public build = async (
    entityBuildParams: PackageEntityBuildParams
  ): Promise<PackageEntityBuildResponse> => {
    const packageEntity = await this._buildPackageEntity(entityBuildParams);
    return packageEntity;
  };

  private _buildPackageEntity = async (
    entityBuildParams: PackageEntityBuildParams
  ): Promise<PackageEntityBuildResponse> => {
    const { hostedBy, priceDetails, lessonAmount, isOffering, packageType, packageDurations } =
      entityBuildParams;
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
    if (savedDbTeacher.teacherData) {
      const teacherHourlyRate = savedDbTeacher.teacherData.hourlyRate;
      const priceDetails = {
        currency: teacherHourlyRate.currency!,
        hourlyPrice: teacherHourlyRate.amount!,
      };
      return priceDetails;
    } else {
      return { hourlyPrice: 35, currency: 'SGD' };
    }
  };

  public init = async (entityInitParams: PackageEntityInitParams): Promise<this> => {
    const { makeUserDbService } = entityInitParams;
    this._userDbService = await makeUserDbService;
    return this;
  };
}

export { PackageEntity, PackageEntityBuildResponse, PackageEntityBuildParams };
