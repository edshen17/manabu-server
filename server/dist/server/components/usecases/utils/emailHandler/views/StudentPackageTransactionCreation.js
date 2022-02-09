"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StudentPackageTransactionCreation = void 0;
const convertToTitlecase_1 = require("../../convertToTitlecase");
const BodyText_1 = require("../components/BodyText");
const ViewLessonPlanButton_1 = require("../components/Buttons/ViewLessonPlanButton");
const Email_1 = require("../components/Email");
const EmailTable_1 = require("../components/EmailTable");
const StudentPackageTransactionCreation = {
    template: `
    <email :name="name">
      <body-text>{{ $t("studentPackageTransactionCreation.body") }}</body-text>
      <email-table :rowData="rowData"/>
      <view-lesson-plan-button :packageTransaction="packageTransaction"/>
    </email>
  `,
    name: 'StudentPackageTransactionCreation',
    components: {
        Email: Email_1.Email,
        BodyText: BodyText_1.BodyText,
        EmailTable: EmailTable_1.EmailTable,
        ViewLessonPlanButton: ViewLessonPlanButton_1.ViewLessonPlanButton,
    },
    props: {
        name: {
            type: String,
            required: true,
        },
        balanceTransaction: {
            type: Object,
            required: true,
        },
    },
    data() {
        return {};
    },
    computed: {
        rowData: {
            get() {
                const self = this;
                const balanceTransaction = this.balanceTransaction;
                const packageTransaction = balanceTransaction.packageTransactionData;
                const pkg = packageTransaction.packageData;
                const rowData = [
                    {
                        key: self.$t('common.table.teacherName'),
                        value: packageTransaction.hostedByData.name,
                    },
                    {
                        key: self.$t('common.table.lessonPlan'),
                        value: (0, convertToTitlecase_1.convertToTitlecase)(pkg.name),
                    },
                    {
                        key: self.$t('common.table.lessonDetails'),
                        value: `${pkg.lessonAmount} x ${packageTransaction.lessonDuration} min lessons`,
                    },
                    {
                        key: self.$t('common.table.terminationDate'),
                        value: packageTransaction.terminationDate,
                    },
                    {
                        key: self.$t('common.table.totalPrice'),
                        value: `${balanceTransaction.totalPayment} ${balanceTransaction.currency}`,
                    },
                ];
                return rowData;
            },
        },
        packageTransaction: {
            get() {
                const packageTransaction = this.balanceTransaction.packageTransactionData;
                return packageTransaction;
            },
        },
    },
};
exports.StudentPackageTransactionCreation = StudentPackageTransactionCreation;
