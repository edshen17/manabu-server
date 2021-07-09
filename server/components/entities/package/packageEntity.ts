import { JoinedUserDoc, UserDbService } from '../../dataAccess/services/user/userDbService';
import { AbstractEntity } from '../abstractions/AbstractEntity';
import { IEntityValidator } from '../abstractions/IEntityValidator';

type OptionalPackageEntityInitParams = {
  makeUserDbService: Promise<UserDbService>;
};

type PackageEntityBuildParams = {
  hostedById: string;
  lessonAmount: number;
  isOffering: boolean;
  packageType: string;
  packageDurations: number[];
};

type PriceDetails = { hourlyPrice: number; currency: string };

type PackageEntityBuildResponse = {
  hostedById: string;
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

  protected _buildTemplate = async (
    buildParams: PackageEntityBuildParams
  ): Promise<PackageEntityBuildResponse> => {
    const { hostedById, lessonAmount, isOffering, packageType, packageDurations } = buildParams;
    const priceDetails = await this._getPriceDetails(hostedById);
    const packageEntity = Object.freeze({
      hostedById,
      priceDetails,
      lessonAmount,
      isOffering,
      packageType,
      packageDurations,
    });
    return packageEntity;
  };

  private _getPriceDetails = async (hostedById: string) => {
    const savedDbTeacher: JoinedUserDoc = await this.getDbDataById({
      dbService: this._userDbService,
      _id: hostedById,
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
