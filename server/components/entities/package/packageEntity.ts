import { IEntity } from '../abstractions/IEntity';

class PackageEntity implements IEntity {
  build(packageData: any): any {
    const { hostedBy, priceDetails, lessonAmount, isOffering, packageType, packageDurations } =
      packageData;
    return Object.freeze({
      getHostedBy: () => hostedBy,
      getPriceDetails: () => priceDetails,
      getLessonAmount: () => lessonAmount,
      getIsOffering: () => isOffering,
      getPackageType: () => packageType,
      getPackageDurations: () => packageDurations,
    });
  }
}

export { PackageEntity };
