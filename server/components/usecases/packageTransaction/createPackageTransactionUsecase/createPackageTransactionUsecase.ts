// // create package transaction. once done, blacklist token in cachedb
// import { PackageTransactionDoc } from '../../../../models/PackageTransaction';
// import { PackageTransactionDbServiceResponse } from '../../../dataAccess/services/packageTransaction/packageTransactionDbService';
// import { AbstractCreateUsecase } from '../../abstractions/AbstractCreateUsecase';
// import { MakeRequestTemplateParams } from '../../abstractions/AbstractUsecase';

// type OptionalCreatePackageTransactionUsecaseInitParams = {};

// type CreatePackageTransactionUsecaseResponse = {
//   packageTransaction: PackageTransactionDoc;
// };

// class CreatePackageTransactionUsecase extends AbstractCreateUsecase<
//   OptionalCreatePackageTransactionUsecaseInitParams,
//   CreatePackageTransactionUsecaseResponse,
//   PackageTransactionDbServiceResponse
// > {
//   protected _makeRequestTemplate = async (
//     props: MakeRequestTemplateParams
//   ): Promise<CreatePackageTransactionUsecaseResponse> => {
//     const { dbServiceAccessOptions, currentAPIUser } = props;
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
//     // const {} = optionalInitParams;
//   };
// }

// export { CreatePackageTransactionUsecase, CreatePackageTransactionUsecaseResponse };
