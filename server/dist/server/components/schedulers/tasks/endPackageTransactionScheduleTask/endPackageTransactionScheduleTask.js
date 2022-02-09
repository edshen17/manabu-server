"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EndPackageTransactionScheduleTask = void 0;
const constants_1 = require("../../../../constants");
const balanceTransactionEntity_1 = require("../../../entities/balanceTransaction/balanceTransactionEntity");
const IPaymentService_1 = require("../../../payment/abstractions/IPaymentService");
const AbstractScheduleTask_1 = require("../../abstractions/AbstractScheduleTask");
class EndPackageTransactionScheduleTask extends AbstractScheduleTask_1.AbstractScheduleTask {
    _packageTransactionDbService;
    _balanceTransactionDbService;
    _userDbService;
    _balanceTransactionEntity;
    _paypalPaymentService;
    _currency;
    _incomeReportDbService;
    _dateRangeKeyHandler;
    execute = async () => {
        const now = this._dayjs();
        const dbServiceAccessOptions = this._packageTransactionDbService.getOverrideDbServiceAccessOptions();
        const session = await this._packageTransactionDbService.startSession();
        let endPackageTransactionScheduleTaskRes;
        session.startTransaction();
        try {
            endPackageTransactionScheduleTaskRes = await this._endPackageTransactions({
                now,
                dbServiceAccessOptions,
                session,
            });
            await session.commitTransaction();
        }
        catch (err) {
            await session.abortTransaction();
            throw err;
        }
        finally {
            session.endSession();
        }
        return endPackageTransactionScheduleTaskRes;
    };
    _endPackageTransactions = async (props) => {
        const { now, dbServiceAccessOptions, session } = props;
        const expiredPackageTransactions = await this._getExpiredPackageTransactions({
            now,
            dbServiceAccessOptions,
            session,
        });
        const endedPackageTransactions = [];
        const endedTeacherBalanceResponses = [];
        for (const packageTransaction of expiredPackageTransactions) {
            const endedPackageTransaction = await this._endPackageTransaction({
                packageTransaction,
                dbServiceAccessOptions,
                session,
            });
            const endedTeacherBalanceTransactionRes = await this._endTeacherBalanceTransaction({
                packageTransaction,
                dbServiceAccessOptions,
                session,
            });
            endedTeacherBalanceResponses.push(endedTeacherBalanceTransactionRes);
            endedPackageTransactions.push(endedPackageTransaction);
        }
        return { endedPackageTransactions, endedTeacherBalanceResponses };
    };
    _getExpiredPackageTransactions = async (props) => {
        const { now, dbServiceAccessOptions, session } = props;
        const expiredPackageTransactions = await this._packageTransactionDbService.find({
            dbServiceAccessOptions,
            searchQuery: {
                $and: [
                    {
                        $or: [
                            {
                                terminationDate: {
                                    $lte: now.toDate(),
                                },
                            },
                            { status: 'completed' },
                        ],
                    },
                    { isTerminated: false },
                ],
            },
            session,
        });
        return expiredPackageTransactions;
    };
    _endPackageTransaction = async (props) => {
        const { packageTransaction, dbServiceAccessOptions, session } = props;
        const endedPackageTransaction = await this._packageTransactionDbService.findOneAndUpdate({
            dbServiceAccessOptions,
            searchQuery: {
                _id: packageTransaction._id,
            },
            updateQuery: {
                isTerminated: true,
                remainingAppointments: 0,
            },
            session,
        });
        return endedPackageTransaction;
    };
    _endTeacherBalanceTransaction = async (props) => {
        const { packageTransaction, dbServiceAccessOptions, session } = props;
        const debitTeacherBalanceTransaction = await this._closeDebitTeacherBalanceTransaction({
            packageTransaction,
            dbServiceAccessOptions,
            session,
        });
        let teacher = await this._userDbService.findById({
            _id: packageTransaction.hostedById,
            dbServiceAccessOptions,
            session,
        });
        const executePayoutRes = await this._executePayout({
            debitTeacherBalanceTransaction,
            teacher,
            dbServiceAccessOptions,
            session,
        });
        const creditTeacherPayoutBalanceTransactions = await this._createCreditTeacherPayoutBalanceTransactions({
            debitTeacherBalanceTransaction,
            dbServiceAccessOptions,
            session,
            executePayoutRes,
        });
        teacher = await this._editTeacherBalance({
            debitTeacherBalanceTransaction,
            creditTeacherPayoutBalanceTransactions,
            dbServiceAccessOptions,
            session,
        });
        const endTeacherBalanceTransactionRes = {
            debitTeacherBalanceTransaction,
            teacher,
            executePayoutRes,
            creditTeacherPayoutBalanceTransactions,
        };
        return endTeacherBalanceTransactionRes;
    };
    _closeDebitTeacherBalanceTransaction = async (props) => {
        const { packageTransaction, dbServiceAccessOptions, session } = props;
        const debitTeacherBalanceTransaction = await this._balanceTransactionDbService.findOneAndUpdate({
            searchQuery: {
                packageTransactionId: packageTransaction._id,
                userId: packageTransaction.hostedById,
                status: balanceTransactionEntity_1.BALANCE_TRANSACTION_ENTITY_STATUS.PENDING,
            },
            updateQuery: {
                status: balanceTransactionEntity_1.BALANCE_TRANSACTION_ENTITY_STATUS.COMPLETED,
            },
            dbServiceAccessOptions,
            session,
        });
        return debitTeacherBalanceTransaction;
    };
    _executePayout = async (props) => {
        const { debitTeacherBalanceTransaction, teacher, dbServiceAccessOptions } = props;
        const { hasRemainingAppointments, balanceChange } = await this._getTeacherPayoutData(debitTeacherBalanceTransaction);
        const incomeReport = await this._updateIncomeReport({
            debitTeacherBalanceTransaction,
            hasRemainingAppointments,
            balanceChange,
            dbServiceAccessOptions,
        });
        const payoutAmount = this._currency(balanceChange).multiply(-1).value;
        const payoutMessage = `Minato Manabu has sent you ${payoutAmount} ${constants_1.DEFAULT_CURRENCY} to your PayPal account.`;
        const executePayoutRes = await this._paypalPaymentService.executePayout({
            type: 'email',
            emailData: {
                subject: `${payoutAmount} Lesson Payout - Minato Manabu`,
                message: payoutMessage,
            },
            id: debitTeacherBalanceTransaction._id,
            recipients: [
                {
                    note: payoutMessage,
                    amount: {
                        currency: debitTeacherBalanceTransaction.currency,
                        value: payoutAmount,
                    },
                    receiver: teacher.teacherData.settings.payoutData.email,
                    sender_item_id: debitTeacherBalanceTransaction.packageTransactionId,
                },
            ],
        });
        return { ...executePayoutRes, incomeReport };
    };
    _getTeacherPayoutData = async (debitTeacherBalanceTransaction) => {
        const packageTransactionData = debitTeacherBalanceTransaction.packageTransactionData;
        const packageData = packageTransactionData.packageData;
        const remainingAppointments = packageTransactionData.remainingAppointments;
        const hasRemainingAppointments = remainingAppointments > 0;
        const packageLessonAmount = packageData.lessonAmount;
        const completedLessons = packageLessonAmount - remainingAppointments;
        const balanceChange = this._currency(debitTeacherBalanceTransaction.totalPayment).multiply((-1 * completedLessons) / packageLessonAmount).value;
        const payoutData = {
            balanceChange,
            hasRemainingAppointments,
        };
        return payoutData;
    };
    _updateIncomeReport = async (props) => {
        const { debitTeacherBalanceTransaction, balanceChange, hasRemainingAppointments, dbServiceAccessOptions, } = props;
        const createdDate = debitTeacherBalanceTransaction.createdDate;
        const payoutFee = this._currency(balanceChange).multiply(constants_1.PAYOUT_RATE).value;
        const additionalEarnings = this._currency(debitTeacherBalanceTransaction.totalPayment).add(balanceChange).value;
        const { dateRangeKey } = this._dateRangeKeyHandler.createKey({
            startDate: this._dayjs(createdDate).date(1).hour(0).minute(0).toDate(),
            endDate: this._dayjs(createdDate)
                .date(this._dayjs().daysInMonth())
                .hour(23)
                .minute(59)
                .toDate(),
        });
        let incomeReport;
        if (hasRemainingAppointments) {
            const expenseDecrease = this._currency(additionalEarnings).add(payoutFee).value;
            incomeReport = await this._incomeReportDbService.findOneAndUpdate({
                searchQuery: {
                    dateRangeKey,
                },
                updateQuery: {
                    $inc: {
                        wageExpense: expenseDecrease,
                        totalExpense: expenseDecrease,
                        netIncome: expenseDecrease,
                    },
                },
                dbServiceAccessOptions,
            });
        }
        else {
            incomeReport = await this._incomeReportDbService.findOneAndUpdate({
                searchQuery: { dateRangeKey },
                updateQuery: {
                    $inc: {
                        wageExpense: payoutFee,
                        totalExpense: payoutFee,
                        netIncome: payoutFee,
                    },
                },
                dbServiceAccessOptions,
            });
        }
        return incomeReport;
    };
    _createCreditTeacherPayoutBalanceTransactions = async (props) => {
        const { dbServiceAccessOptions, session, debitTeacherBalanceTransaction, executePayoutRes } = props;
        const creditTeacherPayoutBalanceTransactionEntity = await this._createCreditTeacherPayoutBalanceTransactionEntities({
            debitTeacherBalanceTransaction,
            executePayoutRes,
        });
        const creditTeacherPayoutBalanceTransaction = await this._balanceTransactionDbService.insertMany({
            modelToInsert: creditTeacherPayoutBalanceTransactionEntity,
            dbServiceAccessOptions,
            session,
        });
        return creditTeacherPayoutBalanceTransaction;
    };
    _createCreditTeacherPayoutBalanceTransactionEntities = async (props) => {
        const { debitTeacherBalanceTransaction } = props;
        const { balanceChange, hasRemainingAppointments } = await this._getTeacherPayoutData(debitTeacherBalanceTransaction);
        const creditTeacherPayoutBalanceTransactionEntities = [];
        const earnedCreditTeacherPayoutBalanceTransactionEntity = await this._createEarnedCreditTeacherPayoutBalanceTransactionEntity({
            ...props,
            balanceChange,
        });
        creditTeacherPayoutBalanceTransactionEntities.push(earnedCreditTeacherPayoutBalanceTransactionEntity);
        if (hasRemainingAppointments) {
            const unearnedCreditTeacherPayoutBalanceTransactionEntity = await this._createUnearnedCreditTeacherPayoutBalanceTransactionEntity({
                debitTeacherBalanceTransaction,
                earnedCreditTeacherPayoutBalanceTransactionEntity,
            });
            creditTeacherPayoutBalanceTransactionEntities.push(unearnedCreditTeacherPayoutBalanceTransactionEntity);
        }
        return creditTeacherPayoutBalanceTransactionEntities;
    };
    _createEarnedCreditTeacherPayoutBalanceTransactionEntity = async (props) => {
        const { debitTeacherBalanceTransaction, executePayoutRes, balanceChange } = props;
        const { userId, currency, packageTransactionId, runningBalance } = debitTeacherBalanceTransaction;
        const { id } = executePayoutRes;
        const earnedCreditTeacherPayoutBalanceTransactionEntity = await this._balanceTransactionEntity.build({
            userId,
            status: balanceTransactionEntity_1.BALANCE_TRANSACTION_ENTITY_STATUS.COMPLETED,
            currency,
            type: balanceTransactionEntity_1.BALANCE_TRANSACTION_ENTITY_TYPE.PAYOUT,
            packageTransactionId: packageTransactionId,
            balanceChange,
            processingFee: 0,
            tax: 0,
            runningBalance: {
                totalAvailable: this._currency(runningBalance.totalAvailable).add(balanceChange).value,
                currency: runningBalance.currency,
            },
            paymentData: {
                gateway: IPaymentService_1.PAYMENT_GATEWAY_NAME.PAYPAL,
                id,
            },
        });
        return earnedCreditTeacherPayoutBalanceTransactionEntity;
    };
    _createUnearnedCreditTeacherPayoutBalanceTransactionEntity = async (props) => {
        const { debitTeacherBalanceTransaction, earnedCreditTeacherPayoutBalanceTransactionEntity } = props;
        const { userId, currency, packageTransactionId, runningBalance } = earnedCreditTeacherPayoutBalanceTransactionEntity;
        const balanceChange = this._currency(debitTeacherBalanceTransaction.totalPayment)
            .add(earnedCreditTeacherPayoutBalanceTransactionEntity.balanceChange)
            .multiply(-1).value;
        const unearnedCreditTeacherPayoutBalanceTransactionEntity = await this._balanceTransactionEntity.build({
            userId,
            status: balanceTransactionEntity_1.BALANCE_TRANSACTION_ENTITY_STATUS.COMPLETED,
            currency,
            type: balanceTransactionEntity_1.BALANCE_TRANSACTION_ENTITY_TYPE.EXPIRED,
            packageTransactionId,
            balanceChange,
            processingFee: 0,
            tax: 0,
            runningBalance: {
                totalAvailable: this._currency(runningBalance.totalAvailable).add(balanceChange).value,
                currency: runningBalance.currency,
            },
        });
        return unearnedCreditTeacherPayoutBalanceTransactionEntity;
    };
    _editTeacherBalance = async (props) => {
        const { debitTeacherBalanceTransaction, creditTeacherPayoutBalanceTransactions, dbServiceAccessOptions, session, } = props;
        const payoutBalanceTransaction = creditTeacherPayoutBalanceTransactions.find((balanceTransaction) => {
            return balanceTransaction.type == balanceTransactionEntity_1.BALANCE_TRANSACTION_ENTITY_TYPE.PAYOUT;
        });
        const balanceChange = this._currency(debitTeacherBalanceTransaction.totalPayment - payoutBalanceTransaction.totalPayment).multiply(-1).value;
        const updatedTeacher = await this._userDbService.findOneAndUpdate({
            searchQuery: {
                _id: payoutBalanceTransaction.userId,
            },
            updateQuery: {
                $inc: {
                    'balance.totalPending': balanceChange,
                    'balance.totalAvailable': balanceChange,
                },
            },
            dbServiceAccessOptions,
            session,
        });
        return updatedTeacher;
    };
    _initTemplate = async (optionalScheduleTaskInitParams) => {
        const { makePackageTransactionDbService, makeBalanceTransactionDbService, makeUserDbService, makeBalanceTransactionEntity, makePaypalPaymentService, makeIncomeReportDbService, makeDateRangeKeyHandler, currency, } = optionalScheduleTaskInitParams;
        this._packageTransactionDbService = await makePackageTransactionDbService;
        this._balanceTransactionDbService = await makeBalanceTransactionDbService;
        this._userDbService = await makeUserDbService;
        this._balanceTransactionEntity = await makeBalanceTransactionEntity;
        this._paypalPaymentService = await makePaypalPaymentService;
        this._currency = currency;
        this._incomeReportDbService = await makeIncomeReportDbService;
        this._dateRangeKeyHandler = makeDateRangeKeyHandler;
    };
}
exports.EndPackageTransactionScheduleTask = EndPackageTransactionScheduleTask;
