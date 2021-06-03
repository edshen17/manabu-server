import { IEntity } from '../abstractions/IEntity';

class PackageTransactionEntity implements IEntity {
  build(packageTransactionData: any): any {
    const {
      hostedBy,
      reservedBy,
      packageId,
      reservationLength,
      terminationDate,
      remainingAppointments,
      lessonLanguage,
      isSubscription,
    } = packageTransactionData;
    return Object.freeze({
      getHostedBy: () => hostedBy,
      getReservedBy: () => reservedBy,
      getPackageId: () => packageId,
      getReservationLength: () => reservationLength,
      getTerminationDate: () => terminationDate,
      getRemainingAppointments: () => remainingAppointments,
      getLessonLanguage: () => lessonLanguage,
      getIsSubscription: () => isSubscription,
    });
  }
}

export { PackageTransactionEntity };
