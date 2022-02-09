"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StudentAppointmentUpdate = void 0;
const convertToTitlecase_1 = require("../../convertToTitlecase");
const BodyText_1 = require("../components/BodyText");
const ViewLessonButton_1 = require("../components/Buttons/ViewLessonButton");
const Email_1 = require("../components/Email");
const EmailTable_1 = require("../components/EmailTable");
const StudentAppointmentUpdate = {
    template: `
    <email :name="name">
      <body-text>{{ $t("studentAppointmentUpdate.body", processedAppointmentData) }}</body-text>
      <email-table :rowData="rowData"/>
      <view-lesson-button :appointment="appointment"/>
    </email>
  `,
    name: 'TeacherAppointmentCreation',
    components: {
        Email: Email_1.Email,
        BodyText: BodyText_1.BodyText,
        ViewLessonButton: ViewLessonButton_1.ViewLessonButton,
        EmailTable: EmailTable_1.EmailTable,
    },
    props: {
        name: {
            type: String,
            required: true,
        },
        appointment: {
            type: Object,
            required: true,
        },
    },
    data() {
        return {};
    },
    computed: {
        processedAppointmentData: {
            get() {
                const appointment = this.appointment;
                const packageTransaction = appointment.packageTransactionData;
                return {
                    studentName: packageTransaction.reservedByData.name,
                };
            },
        },
        rowData: {
            get() {
                const self = this;
                const appointment = this.appointment;
                const packageTransaction = appointment.packageTransactionData;
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
                        key: self.$t('common.table.lessonDate'),
                        value: appointment.startDate,
                    },
                    {
                        key: self.$t('common.table.lessonStatus'),
                        value: (0, convertToTitlecase_1.convertToTitlecase)(appointment.status),
                    },
                ];
                return rowData;
            },
        },
    },
};
exports.StudentAppointmentUpdate = StudentAppointmentUpdate;
