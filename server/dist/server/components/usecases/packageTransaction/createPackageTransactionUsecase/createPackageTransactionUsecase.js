"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreatePackageTransactionUsecase = void 0;
const constants_1 = require("../../../../constants");
const balanceTransactionEntity_1 = require("../../../entities/balanceTransaction/balanceTransactionEntity");
const teacherEntity_1 = require("../../../entities/teacher/teacherEntity");
const userEntity_1 = require("../../../entities/user/userEntity");
const AbstractCreateUsecase_1 = require("../../abstractions/AbstractCreateUsecase");
const createPackageTransactionCheckoutUsecase_1 = require("../../checkout/packageTransaction/createPackageTransactionCheckoutUsecase/createPackageTransactionCheckoutUsecase");
const emailHandler_1 = require("../../utils/emailHandler/emailHandler");
class CreatePackageTransactionUsecase extends AbstractCreateUsecase_1.AbstractCreateUsecase {
    _jwtHandler;
    _cacheDbService;
    _packageTransactionEntity;
    _userDbService;
    _exchangeRateHandler;
    _createBalanceTransactionsUsecase;
    _createIncomeReportUsecase;
    _controllerDataBuilder;
    _emailHandler;
    _createAppointmentsUsecase;
    _graphDbService;
    _teacherDbService;
    _makeRequestTemplate = async (props) => {
        const { query, dbServiceAccessOptions, currentAPIUser } = props;
        const session = await this._dbService.startSession();
        session.startTransaction();
        let usecaseRes;
        try {
            usecaseRes = await this._getCreatePackageTransactionUsecaseRes({
                query,
                dbServiceAccessOptions,
                session,
                currentAPIUser,
            });
            await this._editTeacherPendingBalance({ usecaseRes, dbServiceAccessOptions, session });
            await session.commitTransaction();
        }
        catch (err) {
            await session.abortTransaction();
            throw err;
        }
        finally {
            session.endSession();
        }
        return usecaseRes;
    };
    _getCreatePackageTransactionUsecaseRes = async (props) => {
        const { query, dbServiceAccessOptions, session, currentAPIUser } = props;
        const { token, paymentId } = query;
        const verifiedJwt = await this._getVerifiedJwt(token);
        const { packageTransactionEntityBuildParams, balanceTransactionEntityBuildParams, timeslots } = verifiedJwt;
        const packageTransaction = await this._createPackageTransaction({
            packageTransactionEntityBuildParams,
            dbServiceAccessOptions,
            session,
        });
        const { appointments } = await this._createAppointments({
            packageTransaction,
            timeslots,
            dbServiceAccessOptions,
            session,
            currentAPIUser,
        });
        const { balanceTransactions } = await this._createBalanceTransactions({
            packageTransaction,
            balanceTransactionEntityBuildParams,
            dbServiceAccessOptions,
            paymentId,
            session,
        });
        const incomeReport = await this._createIncomeReport(balanceTransactions);
        const user = await this._userDbService.findOneAndUpdate({
            searchQuery: {
                _id: currentAPIUser.userId,
                'memberships.name': { $ne: 'beta' },
            },
            updateQuery: {
                $addToSet: { memberships: { name: 'beta', createdDate: new Date() } },
            },
            dbServiceAccessOptions,
        });
        const usecaseRes = {
            packageTransaction,
            balanceTransactions,
            incomeReport,
            appointments,
            user,
        };
        return usecaseRes;
    };
    _getVerifiedJwt = async (token) => {
        const jwt = await this._cacheDbService.get({
            hashKey: createPackageTransactionCheckoutUsecase_1.CHECKOUT_TOKEN_HASH_KEY,
            key: token,
        });
        const verifiedJwt = await this._jwtHandler.verify(jwt);
        await this._jwtHandler.blacklist(jwt);
        return verifiedJwt;
    };
    _createPackageTransaction = async (props) => {
        const { packageTransactionEntityBuildParams, dbServiceAccessOptions, session } = props;
        const packageTransactionEntity = await this._packageTransactionEntity.build(packageTransactionEntityBuildParams);
        const packageTransaction = await this._dbService.insert({
            modelToInsert: packageTransactionEntity,
            dbServiceAccessOptions,
            session,
        });
        await this._createStudentTeacherEdge({ packageTransaction, dbServiceAccessOptions });
        return packageTransaction;
    };
    _createStudentTeacherEdge = async (props) => {
        const { packageTransaction, dbServiceAccessOptions } = props;
        const query = `MATCH (teacher:User{ _id: "${packageTransaction.hostedById}" })
    MATCH (student:User{ _id: "${packageTransaction.reservedById}" }) MERGE (teacher)-[r:teaches]->(student)`;
        await this._graphDbService.graphQuery({ query, dbServiceAccessOptions });
        const isRepeatStudent = await this._graphDbService.isConnected({
            node1: `User{ _id: "${packageTransaction.hostedById}" }`,
            node2: `User{ _id: "${packageTransaction.reservedById}" }`,
            relationship: 'teaches',
            dbServiceAccessOptions,
        });
        const updateQuery = {
            $inc: { lessonCount: 1 },
        };
        if (!isRepeatStudent) {
            updateQuery.$inc.studentCount = 1;
        }
        this._teacherDbService.findOneAndUpdate({
            searchQuery: {
                _id: packageTransaction.hostedByData.teacherData._id,
            },
            updateQuery,
            dbServiceAccessOptions,
        });
    };
    _createAppointments = async (props) => {
        const createAppointmentsControllerData = await this._getAppointmentsControllerData({
            ...props,
        });
        const createAppointmentsRes = await this._createAppointmentsUsecase.makeRequest(createAppointmentsControllerData);
        return createAppointmentsRes;
    };
    _getAppointmentsControllerData = async (props) => {
        const { currentAPIUser, session, timeslots, packageTransaction } = props;
        const { _id, hostedById } = packageTransaction;
        const appointments = timeslots.map((timeslot) => {
            const appointmentEntityBuildParams = {
                ...timeslot,
                hostedById,
                packageTransactionId: _id,
            };
            return appointmentEntityBuildParams;
        });
        const createAppointmentsRouteData = {
            rawBody: {},
            headers: {},
            params: {},
            body: {
                appointments,
                session,
            },
            query: {},
            endpointPath: '',
        };
        const createAppointmentsControllerData = this._controllerDataBuilder
            .routeData(createAppointmentsRouteData)
            .currentAPIUser(currentAPIUser)
            .build();
        return createAppointmentsControllerData;
    };
    _createBalanceTransactions = async (props) => {
        const { packageTransaction, dbServiceAccessOptions, balanceTransactionEntityBuildParams, paymentId, session, } = props;
        const { user, teacher } = await this._getUserDataFromPackageTransaction({
            packageTransaction,
            dbServiceAccessOptions,
            session,
        });
        balanceTransactionEntityBuildParams.packageTransactionId = packageTransaction._id;
        balanceTransactionEntityBuildParams.paymentData.id = paymentId;
        const createBalanceTransactionsControllerData = await this._getBalanceTransactionsControllerData({
            user,
            teacher,
            balanceTransactionEntityBuildParams,
            session,
            packageTransaction,
        });
        const balanceTransactionRes = await this._createBalanceTransactionsUsecase.makeRequest(createBalanceTransactionsControllerData);
        this._sendPackageTransactionCreationEmails(balanceTransactionRes.balanceTransactions[0]);
        return balanceTransactionRes;
    };
    _getUserDataFromPackageTransaction = async (props) => {
        const { packageTransaction, dbServiceAccessOptions, session } = props;
        const [user, teacher] = await Promise.all([
            this._userDbService.findById({
                _id: packageTransaction.reservedById,
                dbServiceAccessOptions,
                session,
            }),
            this._userDbService.findById({
                _id: packageTransaction.hostedById,
                dbServiceAccessOptions,
                session,
            }),
        ]);
        return { user, teacher };
    };
    _getBalanceTransactionsControllerData = async (props) => {
        const { user, session } = props;
        const balanceTransactions = await this._getBalanceTransactionBatchBuildParams({ ...props });
        const currentAPIUser = {
            userId: user._id,
            role: user.role,
        };
        const createBalanceTransactionsRouteData = {
            rawBody: {},
            headers: {},
            params: {},
            body: {
                balanceTransactions,
                session,
            },
            query: {},
            endpointPath: '',
        };
        const createBalanceTransactionsControllerData = this._controllerDataBuilder
            .routeData(createBalanceTransactionsRouteData)
            .currentAPIUser(currentAPIUser)
            .build();
        return createBalanceTransactionsControllerData;
    };
    _getBalanceTransactionBatchBuildParams = async (props) => {
        const { balanceTransactionEntityBuildParams, user, teacher, packageTransaction } = props;
        const debitBalanceTransactionEntityBuildParams = await this._createDebitBalanceTransactionEntityBuildParams({
            balanceTransactionEntityBuildParams,
            user,
        });
        const creditBalanceTransactionBuildParams = await this._createCreditBalanceTransactionEntityBuildParams({
            balanceTransactionEntityBuildParams,
            debitBalanceTransactionEntityBuildParams,
            user,
        });
        const debitTeacherBalanceTransactionBuildParams = await this._createDebitTeacherBalanceTransactionEntityBuildParams({
            balanceTransactionEntityBuildParams,
            teacher,
            packageTransaction,
        });
        const balanceTransactions = [
            debitBalanceTransactionEntityBuildParams,
            creditBalanceTransactionBuildParams,
            debitTeacherBalanceTransactionBuildParams,
        ];
        return balanceTransactions;
    };
    _createDebitBalanceTransactionEntityBuildParams = async (props) => {
        const { balanceTransactionEntityBuildParams, user } = props;
        const debitBalanceTransactionEntityBuildParams = this._cloneDeep(balanceTransactionEntityBuildParams);
        debitBalanceTransactionEntityBuildParams.paymentData = undefined;
        debitBalanceTransactionEntityBuildParams.runningBalance.totalAvailable =
            await this._exchangeRateHandler.add({
                addend1: {
                    amount: debitBalanceTransactionEntityBuildParams.balanceChange,
                    sourceCurrency: debitBalanceTransactionEntityBuildParams.currency,
                },
                addend2: {
                    amount: user.balance.totalAvailable,
                    sourceCurrency: user.balance.currency,
                },
                targetCurrency: constants_1.DEFAULT_CURRENCY,
            });
        return debitBalanceTransactionEntityBuildParams;
    };
    _createCreditBalanceTransactionEntityBuildParams = async (props) => {
        const { balanceTransactionEntityBuildParams, debitBalanceTransactionEntityBuildParams, user } = props;
        const creditBalanceTransactionEntityBuildParams = this._cloneDeep(balanceTransactionEntityBuildParams);
        creditBalanceTransactionEntityBuildParams.balanceChange =
            await this._exchangeRateHandler.multiply({
                multiplicand: {
                    amount: debitBalanceTransactionEntityBuildParams.balanceChange,
                },
                multiplier: {
                    amount: -1,
                },
                targetCurrency: constants_1.DEFAULT_CURRENCY,
            });
        creditBalanceTransactionEntityBuildParams.runningBalance.totalAvailable =
            user.balance.totalAvailable;
        creditBalanceTransactionEntityBuildParams.processingFee = 0;
        creditBalanceTransactionEntityBuildParams.type =
            balanceTransactionEntity_1.BALANCE_TRANSACTION_ENTITY_TYPE.CREDIT_TRANSACTION;
        return creditBalanceTransactionEntityBuildParams;
    };
    _createDebitTeacherBalanceTransactionEntityBuildParams = async (props) => {
        const { balanceTransactionEntityBuildParams, teacher, packageTransaction } = props;
        const debitTeacherBalanceTransactionEntityBuildParams = this._cloneDeep(balanceTransactionEntityBuildParams);
        debitTeacherBalanceTransactionEntityBuildParams.userId = teacher._id;
        debitTeacherBalanceTransactionEntityBuildParams.paymentData = undefined;
        debitTeacherBalanceTransactionEntityBuildParams.processingFee =
            await this._getTeacherProcessingFee({
                debitTeacherBalanceTransactionEntityBuildParams,
                teacher,
                packageTransaction,
            });
        debitTeacherBalanceTransactionEntityBuildParams.runningBalance.totalAvailable =
            await this._getTeacherTotalAvailableBalance({
                debitTeacherBalanceTransactionEntityBuildParams,
                teacher,
            });
        debitTeacherBalanceTransactionEntityBuildParams.status =
            balanceTransactionEntity_1.BALANCE_TRANSACTION_ENTITY_STATUS.PENDING;
        return debitTeacherBalanceTransactionEntityBuildParams;
    };
    _getTeacherProcessingFee = async (props) => {
        const { debitTeacherBalanceTransactionEntityBuildParams, teacher, packageTransaction } = props;
        const teacherType = teacher.teacherData.type;
        const isProTeacher = teacherType == teacherEntity_1.TEACHER_ENTITY_TYPE.LICENSED;
        const processingRate = isProTeacher
            ? constants_1.MANABU_PROCESSING_RATE.LICENSED
            : constants_1.MANABU_PROCESSING_RATE.UNLICENSED;
        const processingFee = await this._exchangeRateHandler.multiply({
            multiplicand: {
                amount: debitTeacherBalanceTransactionEntityBuildParams.balanceChange,
            },
            multiplier: {
                amount: processingRate,
            },
            targetCurrency: constants_1.DEFAULT_CURRENCY,
        });
        return processingFee * -1;
    };
    _getTeacherTotalAvailableBalance = async (props) => {
        const { debitTeacherBalanceTransactionEntityBuildParams, teacher } = props;
        const totalPayment = await this._exchangeRateHandler.add({
            addend1: {
                amount: debitTeacherBalanceTransactionEntityBuildParams.balanceChange,
                sourceCurrency: debitTeacherBalanceTransactionEntityBuildParams.currency,
            },
            addend2: {
                amount: debitTeacherBalanceTransactionEntityBuildParams.processingFee,
                sourceCurrency: debitTeacherBalanceTransactionEntityBuildParams.currency,
            },
            targetCurrency: constants_1.DEFAULT_CURRENCY,
        });
        const totalAvailableBalance = await this._exchangeRateHandler.add({
            addend1: {
                amount: totalPayment,
                sourceCurrency: constants_1.DEFAULT_CURRENCY,
            },
            addend2: {
                amount: teacher.balance.totalAvailable,
                sourceCurrency: teacher.balance.currency,
            },
            targetCurrency: teacher.balance.currency,
        });
        return totalAvailableBalance;
    };
    _sendPackageTransactionCreationEmails = (balanceTransaction) => {
        this._sendStudentPackageTransactionCreationEmail(balanceTransaction);
        this._sendTeacherPackageTransactionCreationEmail(balanceTransaction);
    };
    _sendStudentPackageTransactionCreationEmail = (balanceTransaction) => {
        const packageTransaction = balanceTransaction.packageTransactionData;
        this._emailHandler.sendAlertFromUserId({
            userId: packageTransaction.reservedById,
            emailAlertName: userEntity_1.USER_ENTITY_EMAIL_ALERT.PACKAGE_TRANSACTION_CREATION,
            from: emailHandler_1.EMAIL_HANDLER_SENDER_ADDRESS.NOREPLY,
            templateName: emailHandler_1.EMAIL_HANDLER_TEMPLATE.STUDENT_PACKAGE_TRANSACTION_CREATION,
            data: {
                balanceTransaction,
            },
        });
    };
    _sendTeacherPackageTransactionCreationEmail = (balanceTransaction) => {
        const packageTransaction = balanceTransaction.packageTransactionData;
        this._emailHandler.sendAlertFromUserId({
            userId: packageTransaction.hostedById,
            emailAlertName: userEntity_1.USER_ENTITY_EMAIL_ALERT.PACKAGE_TRANSACTION_CREATION,
            from: emailHandler_1.EMAIL_HANDLER_SENDER_ADDRESS.NOREPLY,
            templateName: emailHandler_1.EMAIL_HANDLER_TEMPLATE.TEACHER_PACKAGE_TRANSACTION_CREATION,
            data: {
                balanceTransaction,
            },
        });
    };
    _editTeacherPendingBalance = async (props) => {
        const { usecaseRes, dbServiceAccessOptions, session } = props;
        const { balanceTransactions } = usecaseRes;
        const debitTeacherBalanceTransaction = balanceTransactions[2];
        const teacherTotalPayment = debitTeacherBalanceTransaction.totalPayment;
        await this._userDbService.findOneAndUpdate({
            searchQuery: {
                _id: debitTeacherBalanceTransaction.userId,
            },
            updateQuery: {
                $inc: {
                    'balance.totalPending': teacherTotalPayment,
                    'balance.totalAvailable': teacherTotalPayment,
                },
            },
            dbServiceAccessOptions,
            session,
        });
    };
    _createIncomeReport = async (balanceTransactions) => {
        const debitTeacherBalanceTransaction = balanceTransactions[2];
        const createIncomeReportControllerData = await this._getIncomeReportControllerData(debitTeacherBalanceTransaction);
        const createIncomeReportRes = await this._createIncomeReportUsecase.makeRequest(createIncomeReportControllerData);
        const { incomeReport } = createIncomeReportRes;
        return incomeReport;
    };
    _getIncomeReportControllerData = async (debitTeacherBalanceTransaction) => {
        const { currency, balanceChange, totalPayment } = debitTeacherBalanceTransaction;
        const currentAPIUser = {
            userId: undefined,
            role: 'admin',
        };
        const convertedRevenue = await this._exchangeRateHandler.convert({
            amount: balanceChange,
            sourceCurrency: currency,
            targetCurrency: constants_1.DEFAULT_CURRENCY,
        });
        const convertedWageExpense = (await this._exchangeRateHandler.convert({
            amount: totalPayment,
            sourceCurrency: currency,
            targetCurrency: constants_1.DEFAULT_CURRENCY,
        })) * -1;
        const createIncomeReportRouteData = {
            rawBody: {},
            headers: {},
            params: {},
            body: {
                revenue: convertedRevenue,
                wageExpense: convertedWageExpense,
            },
            query: {},
            endpointPath: '',
        };
        const createIncomeReportControllerData = this._controllerDataBuilder
            .routeData(createIncomeReportRouteData)
            .currentAPIUser(currentAPIUser)
            .build();
        return createIncomeReportControllerData;
    };
    _initTemplate = async (optionalInitParams) => {
        const { makeJwtHandler, makeCacheDbService, makePackageTransactionEntity, makeUserDbService, makeExchangeRateHandler, makeCreateBalanceTransactionsUsecase, makeControllerDataBuilder, makeEmailHandler, makeCreateIncomeReportUsecase, makeCreateAppointmentsUsecase, makeGraphDbService, makeTeacherDbService, } = optionalInitParams;
        this._jwtHandler = await makeJwtHandler;
        this._cacheDbService = await makeCacheDbService;
        this._packageTransactionEntity = await makePackageTransactionEntity;
        this._userDbService = await makeUserDbService;
        this._exchangeRateHandler = await makeExchangeRateHandler;
        this._createBalanceTransactionsUsecase = await makeCreateBalanceTransactionsUsecase;
        this._controllerDataBuilder = makeControllerDataBuilder;
        this._emailHandler = await makeEmailHandler;
        this._createIncomeReportUsecase = await makeCreateIncomeReportUsecase;
        this._createAppointmentsUsecase = await makeCreateAppointmentsUsecase;
        this._graphDbService = await makeGraphDbService;
        this._teacherDbService = await makeTeacherDbService;
    };
}
exports.CreatePackageTransactionUsecase = CreatePackageTransactionUsecase;
