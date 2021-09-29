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
  EditPackageUsecaseResponse,
  PackageDoc
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
    const { params, body, dbServiceAccessOptions } = props;
    const { packageId } = params;
    const updatedPackage = await this._editAvailableTime({
      packageId,
      body,
      dbServiceAccessOptions,
    });
    const usecaseRes = {
      package: updatedPackage,
    };
    return usecaseRes;
  };

  private _editAvailableTime = async (props: {
    packageId: ObjectId;
    body: StringKeyObject;
    dbServiceAccessOptions: DbServiceAccessOptions;
  }): Promise<PackageDoc> => {
    const { packageId, body, dbServiceAccessOptions } = props;
    const availableTime = await this._dbService.findOneAndUpdate({
      _id: packageId,
      updateQuery: body,
      dbServiceAccessOptions,
    });
    return availableTime;
  };
}

export { EditPackageUsecase, EditPackageUsecaseResponse };
