import { ObjectId } from 'mongoose';
import { PackageDoc } from '../../../../models/Package';
import { StringKeyObject } from '../../../../types/custom';
import { DbServiceAccessOptions } from '../../../dataAccess/abstractions/IDbService';
import { PACKAGE_ENTITY_TYPE } from '../../../entities/package/packageEntity';
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
    const updatedPackage = await this._editPackage({
      packageId,
      body,
      dbServiceAccessOptions,
    });
    const usecaseRes = {
      package: updatedPackage,
    };
    return usecaseRes;
  };

  private _editPackage = async (props: {
    packageId: ObjectId;
    body: StringKeyObject;
    dbServiceAccessOptions: DbServiceAccessOptions;
  }): Promise<PackageDoc> => {
    const { packageId, body, dbServiceAccessOptions } = props;
    const packageToUpdate = await this._dbService.findById({
      _id: packageId,
      dbServiceAccessOptions,
    });
    const { lessonAmount, packageDesc, packageName } = body;
    const isDefaultPackage = packageToUpdate.packageType == PACKAGE_ENTITY_TYPE.DEFAULT;
    const isEditingDefaultPackageRestrictedFields =
      isDefaultPackage && (lessonAmount || packageDesc || packageName);
    if (!isEditingDefaultPackageRestrictedFields) {
      const updatedPackage = await this._dbService.findOneAndUpdate({
        searchQuery: { _id: packageId },
        updateQuery: body,
        dbServiceAccessOptions,
      });
      return updatedPackage;
    }
    throw new Error('You cannot edit those default fields.');
  };
}

export { EditPackageUsecase, EditPackageUsecaseResponse };
