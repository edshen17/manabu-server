// import { PackageDoc } from '../../../../../models/Package';
// import { JoinedUserDoc } from '../../../../../models/User';
// import { StringKeyObject } from '../../../../../types/custom';
// import { DbServiceAccessOptions } from '../../../../dataAccess/abstractions/IDbService';
// import { TeacherDbServiceResponse } from '../../../../dataAccess/services/teacher/teacherDbService';
// import { ConvertStringToObjectId } from '../../../../entities/utils/convertStringToObjectId';
// import { PaypalHandler } from '../../../../paymentHandlers/paypal/paypalHandler';
// import { StripeHandler } from '../../../../paymentHandlers/stripe/stripeHandler';
// import { AbstractCreateUsecase } from '../../../abstractions/AbstractCreateUsecase';
// import { MakeRequestTemplateParams } from '../../../abstractions/AbstractUsecase';
// import { ConvertToTitlecase } from '../../../utils/convertToTitlecase';

// type OptionalCreatePackageTransactionCheckoutUsecaseInitParams = {
//   makePaypalHandler: Promise<PaypalHandler>;
//   makeStripeHandler: Promise<StripeHandler>;
//   convertStringToObjectId: ConvertStringToObjectId;
//   convertToTitlecase: ConvertToTitlecase;
// };

// type CreatePackageTransactionCheckoutUsecaseResponse = {
//   redirectUrl: string;
// };

// type TestBodyResponse = {
//   teacher: JoinedUserDoc;
//   teacherData: JoinedUserDoc['teacherData'];
//   teacherPackage: PackageDoc;
// };

// type GetRedirectUrlParams = MakeRequestTemplateParams & TestBodyResponse;

// class CreatePackageTransactionCheckoutUsecase extends AbstractCreateUsecase<
//   OptionalCreatePackageTransactionCheckoutUsecaseInitParams,
//   CreatePackageTransactionCheckoutUsecaseResponse,
//   TeacherDbServiceResponse
// > {
//   private _paypalHandler!: PaypalHandler;
//   private _stripeHandler!: StripeHandler;
//   private _convertStringToObjectId!: ConvertStringToObjectId;
//   private _convertToTitlecase!: ConvertToTitlecase;

//   protected _makeRequestTemplate = async (
//     props: MakeRequestTemplateParams
//   ): Promise<CreatePackageTransactionCheckoutUsecaseResponse> => {
//     const { teacher, teacherData, teacherPackage } = await this._testBody(props);
//     const redirectUrl = await this._getRedirectUrl({
//       ...props,
//       teacher,
//       teacherData,
//       teacherPackage,
//     });
//     const usecaseRes = {
//       redirectUrl,
//     };
//     return usecaseRes;
//   };

//   private _testBody = async (props: {
//     body: StringKeyObject;
//     dbServiceAccessOptions: DbServiceAccessOptions;
//   }): Promise<TestBodyResponse> => {
//     const { body, dbServiceAccessOptions } = props;
//     const { teacherId, packageId, lessonDuration, lessonLanguage, lessonAmount } = body;
//     const teacher = <JoinedUserDoc>await this._dbService.findById({
//       _id: this._convertStringToObjectId(teacherId),
//       dbServiceAccessOptions,
//     });
//     const teacherData = teacher.teacherData!;
//     const teacherPackage = <PackageDoc>teacherData.packages.find((pkg) => {
//       return this._deepEqual(this._convertStringToObjectId(packageId), pkg._id);
//     });
//     const isTeacherApproved = teacherData.applicationStatus == 'approved';
//     const isValidLessonDuration = teacherPackage.lessonDurations.includes(lessonDuration);
//     const isValidLessonLanguage =
//       teacherData.teachingLanguages.findIndex((teachingLanguage) => {
//         return teachingLanguage.language == lessonLanguage;
//       }) != -1;
//     const isValidLessonAmount = teacherPackage.lessonAmount == lessonAmount;
//     const isValidBody =
//       isTeacherApproved && isValidLessonDuration && isValidLessonLanguage && isValidLessonAmount;
//     if (!isValidBody) {
//       throw new Error('Invalid body.');
//     }
//     return { teacher, teacherData, teacherPackage };
//   };

//   private _getRedirectUrl = async (props: GetRedirectUrlParams): Promise<string> => {
//     const { query } = props;
//     const { paymentHandler } = query;
//     const processedPaymentHandlerParams = this._getProcessedPaymentHandlerParams();
//     let redirectUrl = '';
//     switch (paymentHandler) {
//       case 'paypal':
//         redirectUrl = await this._getPaypalRedirectUrl(props);
//         break;
//       case 'stripe':
//         break;
//       case 'payNow':
//         break;
//       default:
//         throw new Error('Invalid payment handler query.');
//     }
//     return redirectUrl;
//   };

//   private _getProcessedPaymentHandlerParams = (props: GetRedirectUrlParams) => {
//     const { teacher, teacherData, teacherPackage, currentAPIUser, query } = props;
//     const { paymentHandler } = query;

//     subTotal =
//     const item = {
//       id: `h-${teacher._id}-r-${currentAPIUser.userId}`,
//       name: this._convertToTitlecase(`${teacherPackage.packageName} with ${teacher.name}`),
//       price: '',
//     };
//     return item;
//   };

//   private _getPaypalRedirectUrl = async (props: GetRedirectUrlParams): Promise<string> => {
//     const { teacher, teacherData, teacherPackage, body } = props;
//     const paymentHandlerExecuteParams = {
//       successRedirectUrl: 'https://manabu.sg/success',
//       cancelRedirectUrl: 'https://manabu.sg/cancel',
//       items: [
//         {
//           name: `${teacherPackage.packageName}`, // title case util...
//           sku: '123',
//           price: '100',
//           currency: 'SGD',
//           quantity: 1,
//         },
//       ],
//       currency: 'SGD',
//       total: '100',
//     };
//     const paypalCheckoutRes = await this._paypalHandler.executeSinglePayment(
//       paymentHandlerExecuteParams
//     );
//     const { redirectUrl } = paypalCheckoutRes;
//     return redirectUrl;
//   };

//   protected _initTemplate = async (
//     optionalInitParams: OptionalCreatePackageTransactionCheckoutUsecaseInitParams
//   ): Promise<void> => {
//     const { makePaypalHandler, makeStripeHandler, convertStringToObjectId, convertToTitlecase } =
//       optionalInitParams;
//     this._paypalHandler = await makePaypalHandler;
//     this._stripeHandler = await makeStripeHandler;
//     this._convertStringToObjectId = convertStringToObjectId;
//     this._convertToTitlecase = convertToTitlecase;
//   };
// }

// export { CreatePackageTransactionCheckoutUsecase };
