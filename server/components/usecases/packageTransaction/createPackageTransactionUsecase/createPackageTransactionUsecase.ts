// import { PackageTransactionDoc } from '../../../../models/PackageTransaction';
// import { PackageTransactionDbServiceResponse } from '../../../dataAccess/services/packageTransaction/packageTransactionDbService';
// import { AbstractCreateUsecase } from '../../abstractions/AbstractCreateUsecase';
// import { MakeRequestTemplateParams } from '../../abstractions/AbstractUsecase';
// import { JwtHandler } from '../../utils/jwtHandler/jwtHandler';

// type OptionalCreatePackageTransactionUsecaseInitParams = {
//   makeJwtHandler: Promise<JwtHandler>;
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

//   protected _makeRequestTemplate = async (
//     props: MakeRequestTemplateParams
//   ): Promise<CreatePackageTransactionUsecaseResponse> => {
//     const { query, dbServiceAccessOptions, currentAPIUser } = props;
//     const { token } = query;
//     const packageTransactionBody = await this.
//     if (isValidToken) {
//       const packageTransaction = await this._createPackageTransaction({
//         appointments,
//         dbServiceAccessOptions,
//         currentAPIUser,
//       });
//       const usecaseRes = {
//         packageTransaction,
//       };
//       return usecaseRes;
//     } else {
//       throw new Error();
//     }
//   };

//   protected _initTemplate = async (
//     optionalInitParams: OptionalCreatePackageTransactionUsecaseInitParams
//   ): Promise<void> => {
//     const { makeJwtHandler } = optionalInitParams;
//     this._jwtHandler = await makeJwtHandler;
//   };
// }

// export { CreatePackageTransactionUsecase, CreatePackageTransactionUsecaseResponse };
