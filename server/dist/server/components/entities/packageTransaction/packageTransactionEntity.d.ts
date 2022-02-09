import { ObjectId } from 'mongoose';
import { AbstractEntityValidator } from '../../validators/abstractions/AbstractEntityValidator';
import { AbstractEntity } from '../abstractions/AbstractEntity';
declare type OptionalPackageTransactionEntityInitParams = {
    dayjs: any;
};
declare type PackageTransactionEntityBuildParams = {
    hostedById: ObjectId;
    reservedById: ObjectId;
    packageId: ObjectId;
    lessonDuration: number;
    remainingAppointments: number;
    lessonLanguage: string;
    isSubscription: boolean;
};
declare type PackageTransactionEntityBuildResponse = {
    hostedById: ObjectId;
    reservedById: ObjectId;
    packageId: ObjectId;
    lessonDuration: number;
    terminationDate: Date;
    remainingAppointments: number;
    lessonLanguage: string;
    isSubscription: boolean;
    transactionDate: Date;
    isTerminated: boolean;
    status: string;
    createdDate: Date;
    lastModifiedDate: Date;
};
declare class PackageTransactionEntity extends AbstractEntity<OptionalPackageTransactionEntityInitParams, PackageTransactionEntityBuildParams, PackageTransactionEntityBuildResponse> {
    private _dayjs;
    protected _buildTemplate: (buildParams: PackageTransactionEntityBuildParams) => Promise<PackageTransactionEntityBuildResponse>;
    protected _initTemplate: (optionalInitParams: Omit<{
        makeEntityValidator: AbstractEntityValidator;
    } & OptionalPackageTransactionEntityInitParams, 'makeEntityValidator'>) => Promise<void>;
}
export { PackageTransactionEntity, PackageTransactionEntityBuildParams, PackageTransactionEntityBuildResponse, };
