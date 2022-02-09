"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VerifyNowButton = void 0;
const EmailButton_1 = require("./EmailButton");
const VerifyNowButton = {
    template: `
    <email-button v-bind="buttonProps"/>
  `,
    name: 'VerifyNowButton',
    components: {
        EmailButton: EmailButton_1.EmailButton,
    },
    props: {
        verificationToken: {
            type: String,
            required: true,
        },
    },
    data() {
        return {};
    },
    computed: {
        buttonProps: {
            get() {
                const self = this;
                return {
                    isServerEndpoint: true,
                    endpoint: `/users/auth/emailToken/${self.verificationToken}/verify`,
                    text: self.$t('common.button.verifyNow'),
                    paddingTop: '0px',
                };
            },
        },
    },
};
exports.VerifyNowButton = VerifyNowButton;
