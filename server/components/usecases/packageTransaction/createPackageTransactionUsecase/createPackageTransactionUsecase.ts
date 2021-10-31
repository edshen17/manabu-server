// import { PackageTransactionDoc } from '../../../../models/PackageTransaction';
// import { CacheDbService } from '../../../dataAccess/services/cache/cacheDbService';
// import { PackageTransactionDbServiceResponse } from '../../../dataAccess/services/packageTransaction/packageTransactionDbService';
// import { PackageTransactionEntityBuildParams } from '../../../entities/packageTransaction/packageTransactionEntity';
// import { AbstractCreateUsecase } from '../../abstractions/AbstractCreateUsecase';
// import { MakeRequestTemplateParams } from '../../abstractions/AbstractUsecase';
// import { CHECKOUT_TOKEN_HASH_KEY } from '../../checkout/packageTransaction/createPackageTransactionCheckoutUsecase/createPackageTransactionCheckoutUsecase';
// import { JwtHandler } from '../../utils/jwtHandler/jwtHandler';

// type OptionalCreatePackageTransactionUsecaseInitParams = {
//   makeJwtHandler: Promise<JwtHandler>;
//   makeCacheDbService: Promise<CacheDbService>;
// };

// type CreatePackageTransactionUsecaseResponse = {
//   packageTransaction: PackageTransactionDoc;
// };

// class CreatePackageTransactionUsecase extends AbstractCreateUsecase<
//   OptionalCreatePackageTransactionUsecaseInitParams,
//   CreatePackageTransactionUsecaseResponse,
//   PackageTransactionDbServiceResponse
// > {
//   private _jwtHandler!: JwtHandler;
//   private _cacheDbService!: CacheDbService;

//   protected _makeRequestTemplate = async (
//     props: MakeRequestTemplateParams
//   ): Promise<CreatePackageTransactionUsecaseResponse> => {
//     const { query, dbServiceAccessOptions, currentAPIUser } = props;
//     const { token } = query;
//     const packageTransactionEntityBuildParams: PackageTransactionEntityBuildParams =
//       await this._getPackageTransactionEntityBuildParams(token);

//     const packageTransaction = await this._createPackageTransaction({
//       appointments,
//       dbServiceAccessOptions,
//       currentAPIUser,
//     });
//     const usecaseRes = {
//       packageTransaction,
//     };
//     return usecaseRes;
//   };

//   private _getPackageTransactionEntityBuildParams = async (
//     token: string
//   ): Promise<PackageTransactionEntityBuildParams> => {
//     const jwt = await this._cacheDbService.get({
//       hashKey: CHECKOUT_TOKEN_HASH_KEY,
//       key: token,
//     });
//     const packageTransactionEntityBuildParams = await this._jwtHandler.verify(jwt);
//     await this._jwtHandler.blacklist(jwt);
//     return packageTransactionEntityBuildParams;
//   };

//   protected _initTemplate = async (
//     optionalInitParams: OptionalCreatePackageTransactionUsecaseInitParams
//   ): Promise<void> => {
//     const { makeJwtHandler, makeCacheDbService } = optionalInitParams;
//     this._jwtHandler = await makeJwtHandler;
//     this._cacheDbService = await makeCacheDbService;
//   };
// }

// export { CreatePackageTransactionUsecase, CreatePackageTransactionUsecaseResponse };
