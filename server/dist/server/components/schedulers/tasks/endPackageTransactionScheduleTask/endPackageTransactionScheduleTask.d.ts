import { BalanceTransactionDoc } from '../../../../models/BalanceTransaction';
import { IncomeReportDoc } from '../../../../models/IncomeReport';
import { PackageTransactionDoc } from '../../../../models/PackageTransaction';
import { JoinedUserDoc } from '../../../../models/User';
import { BalanceTransactionDbService } from '../../../dataAccess/services/balanceTransaction/balanceTransactionDbService';
import { IncomeReportDbService } from '../../../dataAccess/services/incomeReport/incomeReportDbService';
import { PackageTransactionDbService } from '../../../dataAccess/services/packageTransaction/packageTransactionDbService';
import { UserDbService } from '../../../dataAccess/services/user/userDbService';
import { BalanceTransactionEntity } from '../../../entities/balanceTransaction/balanceTransactionEntity';
import { DateRangeKeyHandler } from '../../../entities/utils/dateRangeKeyHandler/dateRangeKeyHandler';
import { PaymentServiceExecutePayoutResponse } from '../../../payment/abstractions/IPaymentService';
import { PaypalPaymentService } from '../../../payment/services/paypal/paypalPaymentService';
import { AbstractScheduleTask } from '../../abstractions/AbstractScheduleTask';
import { ScheduleTaskInitParams } from '../../abstractions/IScheduleTask';
declare type OptionalEndPackageTransactionScheduleTaskInitParams = {
    makePackageTransactionDbService: Promise<PackageTransactionDbService>;
    makeBalanceTransactionDbService: Promise<BalanceTransactionDbService>;
    makeUserDbService: Promise<UserDbService>;
    makeBalanceTransactionEntity: Promise<BalanceTransactionEntity>;
    makePaypalPaymentService: Promise<PaypalPaymentService>;
    currency: any;
    makeIncomeReportDbService: Promise<IncomeReportDbService>;
    makeDateRangeKeyHandler: DateRangeKeyHandler;
};
declare type EndPackageTransactionScheduleTaskResponse = {
    endedPackageTransactions: PackageTransactionDoc[];
    endedTeacherBalanceResponses: EndTeacherBalanceTransactionResponse[];
};
declare type ExecutePayoutResponse = PaymentServiceExecutePayoutResponse & {
    incomeReport: IncomeReportDoc;
};
declare type EndTeacherBalanceTransactionResponse = {
    debitTeacherBalanceTransaction: BalanceTransactionDoc;
    teacher: JoinedUserDoc;
    executePayoutRes: ExecutePayoutResponse;
    creditTeacherPayoutBalanceTransactions: BalanceTransactionDoc[];
};
declare class EndPackageTransactionScheduleTask extends AbstractScheduleTask<OptionalEndPackageTransactionScheduleTaskInitParams, EndPackageTransactionScheduleTaskResponse> {
    private _packageTransactionDbService;
    private _balanceTransactionDbService;
    private _userDbService;
    private _balanceTransactionEntity;
    private _paypalPaymentService;
    private _currency;
    private _incomeReportDbService;
    private _dateRangeKeyHandler;
    execute: () => Promise<EndPackageTransactionScheduleTaskResponse>;
    private _endPackageTransactions;
    private _getExpiredPackageTransactions;
    private _endPackageTransaction;
    private _endTeacherBalanceTransaction;
    private _closeDebitTeacherBalanceTransaction;
    private _executePayout;
    private _getTeacherPayoutData;
    private _updateIncomeReport;
    private _createCreditTeacherPayoutBalanceTransactions;
    private _createCreditTeacherPayoutBalanceTransactionEntities;
    private _createEarnedCreditTeacherPayoutBalanceTransactionEntity;
    private _createUnearnedCreditTeacherPayoutBalanceTransactionEntity;
    private _editTeacherBalance;
    protected _initTemplate: (optionalScheduleTaskInitParams: Omit<ScheduleTaskInitParams<OptionalEndPackageTransactionScheduleTaskInitParams>, 'dayjs'>) => Promise<void>;
}
export { EndPackageTransactionScheduleTask };
