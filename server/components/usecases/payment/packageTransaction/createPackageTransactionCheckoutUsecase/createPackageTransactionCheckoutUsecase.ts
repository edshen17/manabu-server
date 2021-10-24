// import { JoinedUserDoc } from '../../../../../models/User';
// import { StringKeyObject } from '../../../../../types/custom';
// import { DbServiceAccessOptions } from '../../../../dataAccess/abstractions/IDbService';
// import { PackageDbService } from '../../../../dataAccess/services/package/packageDbService';
// import { ConvertStringToObjectId } from '../../../../entities/utils/convertStringToObjectId';
// import { PaypalHandler } from '../../../../paymentHandlers/paypal/paypalHandler';
// import { StripeHandler } from '../../../../paymentHandlers/stripe/stripeHandler';
// import { AbstractCreateUsecase } from '../../../abstractions/AbstractCreateUsecase';
// import { MakeRequestTemplateParams } from '../../../abstractions/AbstractUsecase';

// type OptionalCreatePackageTransactionCheckoutUsecaseInitParams = {
//   makePackageDbService: Promise<PackageDbService>;
//   makePaypalHandler: Promise<PaypalHandler>;
//   makeStripeHandler: Promise<StripeHandler>;
//   convertStringToObjectId: ConvertStringToObjectId;
// };

// type CreatePackageTransactionCheckoutUsecaseResponse = {
//   redirectUrl: string;
// };

// class CreatePackageTransactionCheckoutUsecase extends AbstractCreateUsecase<
//   OptionalCreatePackageTransactionCheckoutUsecaseInitParams,
//   CreatePackageTransactionCheckoutUsecaseResponse,
//   undefined
// > {
//   private _packageDbService!: PackageDbService;
//   private _paypalHandler!: PaypalHandler;
//   private _stripeHandler!: StripeHandler;
//   private _convertStringToObjectId!: ConvertStringToObjectId;

//   protected _makeRequestTemplate = async (
//     props: MakeRequestTemplateParams
//   ): Promise<CreatePackageTransactionCheckoutUsecaseResponse> => {
//     await this._testRouteData(props);
//     const redirectUrl = 'this._getRedirectUrl(props)';
//     const usecaseRes = {
//       redirectUrl,
//     };
//     return usecaseRes;
//   };

//   private _testRouteData = async (props: MakeRequestTemplateParams): Promise<void> => {
//     const { body, query, currentAPIUser, dbServiceAccessOptions } = props;
//     await this._testBody({ body, dbServiceAccessOptions });
//     console.log('hihi');
//     // this._testQuery(query);
//     // this._testCurrentAPIUser(currentAPIUser);
//   };

//   private _testBody = async (props: {
//     body: StringKeyObject;
//     dbServiceAccessOptions: DbServiceAccessOptions;
//   }): Promise<void> => {
//     const { body, dbServiceAccessOptions } = props;
//     const { teacherId, packageId, lessonDuration, lessonLanguage, lessonAmount } = body;
//     const pkg = await this._packageDbService.findById({
//       _id: packageId,
//       dbServiceAccessOptions,
//     });
//     const teacher = (await this._packageDbService.findById({
//       _id: packageId,
//       dbServiceAccessOptions: { ...dbServiceAccessOptions, isReturningParent: true },
//     })) as unknown as JoinedUserDoc;
//     console.log(teacher, 'hihi');
//     const isTeacherApproved = teacher.applicationStatus == 'approved';
//     const isSameTeacherId = this._deepEqual(teacher._id, this._convertStringToObjectId(teacherId));
//     const isValidTeacher = isSameTeacherId && isTeacherApproved;
//     const isValidLessonDuration = pkg.lessonDurations.includes(lessonDuration);
//     const isValidLessonLanguage = teacher.teachingLanguages.find((teachingLanguage) => {
//       return teachingLanguage.language == lessonLanguage;
//     });
//     const isValidLessonAmount = pkg.lessonAmount == lessonAmount;
//     const isValidBody =
//       isValidTeacher && isValidLessonDuration && isValidLessonLanguage && isValidLessonAmount;
//     return isValidBody;
//   };

//   //   private _getRedirectUrl = (props: MakeRequestTemplateParams): string => {};

//   protected _initTemplate = async (
//     optionalInitParams: OptionalCreatePackageTransactionCheckoutUsecaseInitParams
//   ): Promise<void> => {
//     const { makePackageDbService, makePaypalHandler, makeStripeHandler, convertStringToObjectId } =
//       optionalInitParams;
//     this._packageDbService = await makePackageDbService;
//     this._paypalHandler = await makePaypalHandler;
//     this._stripeHandler = await makeStripeHandler;
//     this._convertStringToObjectId = convertStringToObjectId;
//   };
// }

// export { CreatePackageTransactionCheckoutUsecase };
