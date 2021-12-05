import { ObjectId } from 'mongoose';
import { PackageDoc } from '../../../../models/Package';
import { StringKeyObject } from '../../../../types/custom';
import { DbServiceAccessOptions } from '../../../dataAccess/abstractions/IDbService';
import { PackageDbServiceResponse } from '../../../dataAccess/services/package/packageDbService';
import { PACKAGE_ENTITY_TYPE } from '../../../entities/package/packageEntity';
import { AbstractDeleteUsecase } from '../../abstractions/AbstractDeleteUsecase';
import { MakeRequestTemplateParams } from '../../abstractions/AbstractUsecase';

type OptionalDeletePackageUsecaseInitParams = {};

type DeletePackageUsecaseResponse = {
  package: PackageDoc;
};

class DeletePackageUsecase extends AbstractDeleteUsecase<
  OptionalDeletePackageUsecaseInitParams,
  DeletePackageUsecaseResponse,
  PackageDbServiceResponse
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
    const packageToDelete = <PackageDoc>await this._dbService.findById({
      _id: packageId,
      dbServiceAccessOptions,
    });
    const isDefaultPackage = packageToDelete.type == PACKAGE_ENTITY_TYPE.DEFAULT;
    if (!isDefaultPackage) {
      const deletedPackage = <PackageDoc>await this._dbService.findByIdAndDelete({
        _id: packageId,
        dbServiceAccessOptions,
      });
      return deletedPackage;
    }
    throw new Error('You cannot delete a default package.');
  };
}

export { DeletePackageUsecase, DeletePackageUsecaseResponse };
