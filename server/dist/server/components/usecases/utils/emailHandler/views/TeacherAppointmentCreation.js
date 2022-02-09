"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeacherAppointmentCreation = void 0;
const convertToTitlecase_1 = require("../../convertToTitlecase");
const BodyText_1 = require("../components/BodyText");
const ConfirmLessonButton_1 = require("../components/Buttons/ConfirmLessonButton");
const Email_1 = require("../components/Email");
const EmailTable_1 = require("../components/EmailTable");
const TeacherAppointmentCreation = {
    template: `
    <email :name="name">
      <body-text>{{ $t("teacherAppointmentCreation.body", processedAppointmentData) }}</body-text>
      <email-table :rowData="rowData"/>
      <confirm-lesson-button :appointment="appointment"/>
    </email>
  `,
    name: 'TeacherAppointmentCreation',
    components: {
        Email: Email_1.Email,
        BodyText: BodyText_1.BodyText,
        ConfirmLessonButton: ConfirmLessonButton_1.ConfirmLessonButton,
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
                        key: self.$t('common.table.studentName'),
                        value: packageTransaction.reservedByData.name,
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
exports.TeacherAppointmentCreation = TeacherAppointmentCreation;
