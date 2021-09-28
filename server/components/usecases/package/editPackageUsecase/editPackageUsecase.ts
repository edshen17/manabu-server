import { ObjectId } from 'mongoose';
import { PackageDoc } from '../../../../models/Package';
import { StringKeyObject } from '../../../../types/custom';
import { DbServiceAccessOptions } from '../../../dataAccess/abstractions/IDbService';
import { AbstractEditUsecase } from '../../abstractions/AbstractEditUsecase';
import { MakeRequestTemplateParams } from '../../abstractions/AbstractUsecase';

type OptionalEditPackageUsecaseInitParams = {};

type EditPackageUsecaseResponse = {
  package: PackageDoc;
};

class EditPackageUsecase extends AbstractEditUsecase<
  OptionalEditPackageUsecaseInitParams,
  EditPackageUsecaseResponse
> {
  protected _getResourceAccessData = (): StringKeyObject => {
    return {
      hasResourceAccessCheck: true,
      paramIdName: 'packageId',
    };
  };

  protected _makeRequestTemplate = async (
    props: MakeRequestTemplateParams
  ): Promise<EditPackageUsecaseResponse> => {
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
}

export { EditPackageUsecase, EditPackageUsecaseResponse };
