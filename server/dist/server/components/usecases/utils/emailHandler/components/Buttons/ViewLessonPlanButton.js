"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ViewLessonPlanButton = void 0;
const EmailButton_1 = require("./EmailButton");
const ViewLessonPlanButton = {
    template: `
    <email-button v-bind="buttonProps"/>
  `,
    name: 'ViewLessonPlanButton',
    components: {
        EmailButton: EmailButton_1.EmailButton,
    },
    props: {
        packageTransaction: {
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
                const packageTransactionId = this.packageTransaction._id;
                return {
                    endpoint: `/packageTransaction/${packageTransactionId}`,
                    text: this.$t('common.button.viewLessonPlan'),
                };
            },
        },
    },
};
exports.ViewLessonPlanButton = ViewLessonPlanButton;
