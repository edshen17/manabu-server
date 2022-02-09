"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfirmLessonButton = void 0;
const EmailButton_1 = require("./EmailButton");
const ConfirmLessonButton = {
    template: `
    <email-button v-bind="buttonProps"/>
  `,
    name: 'ConfirmLessonButton',
    components: {
        EmailButton: EmailButton_1.EmailButton,
    },
    props: {
        appointment: {
            type: Object,
            required: true,
        },
    },
    data() {
        return {};
    },
    computed: {
        buttonProps: {
            get() {
                const appointmentId = this.appointment._id;
                return {
                    endpoint: `/appointment/${appointmentId}`,
                    text: this.$t('common.button.confirmLesson'),
                };
            },
        },
    },
};
exports.ConfirmLessonButton = ConfirmLessonButton;
