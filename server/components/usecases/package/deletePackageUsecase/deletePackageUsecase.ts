import { ObjectId } from 'mongoose';
import { PackageDoc } from '../../../../models/Package';
import { StringKeyObject } from '../../../../types/custom';
import { DbServiceAccessOptions } from '../../../dataAccess/abstractions/IDbService';
import {
  AbstractDeleteUsecase,
  AbstractDeleteUsecaseInitParams,
} from '../../abstractions/AbstractDeleteUsecase';
import { MakeRequestTemplateParams } from '../../abstractions/AbstractUsecase';

type OptionalDeletePackageUsecaseInitParams = {};

type DeletePackageUsecaseResponse = {
  package: PackageDoc;
};

class DeletePackageUsecase extends AbstractDeleteUsecase<
  OptionalDeletePackageUsecaseInitParams,
  DeletePackageUsecaseResponse
> {
  protected _getResourceAccessData = (): StringKeyObject => {
    return {
      hasResourceAccessCheck: true,
      paramIdName: 'packageId',
    };
  };

  protected _makeRequestTemplate = async (
    props: MakeRequestTemplateParams
  ): Promise<DeletePackageUsecaseResponse> => {
    const { params, dbServiceAccessOptions } = props;
    const { packageId } = params;
    const deletedPackage = await this._deletePackage({
      packageId,
      dbServiceAccessOptions,
    });
    const usecaseRes = {
      package: deletedPackage,
    };
    return usecaseRes;
  };

  private _deletePackage = async (props: {
    packageId: ObjectId;
    dbServiceAccessOptions: DbServiceAccessOptions;
  }): Promise<PackageDoc> => {
    const { packageId, dbServiceAccessOptions } = props;
    const deletedPackage = await this._dbService.findByIdAndDelete({
      _id: packageId,
      dbServiceAccessOptions,
    });
    return deletedPackage;
  };

  protected _initTemplate = async (
    optionalInitParams: AbstractDeleteUsecaseInitParams<OptionalDeletePackageUsecaseInitParams>
  ) => {
    const { makeDeleteEntityValidator } = optionalInitParams;
    this._deleteEntityValidator = makeDeleteEntityValidator;
  };
}

export { DeletePackageUsecase, DeletePackageUsecaseResponse };
