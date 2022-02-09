"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailVerification = void 0;
const BodyText_1 = require("../components/BodyText");
const VerifyNowButton_1 = require("../components/Buttons/VerifyNowButton");
const Email_1 = require("../components/Email");
const EmailTable_1 = require("../components/EmailTable");
const EmailVerification = {
    template: `
    <email :name="name">
      <body-text>{{ $t("emailVerification.body") }}</body-text>
      <verify-now-button :verificationToken="verificationToken"/>
    </email>
  `,
    name: 'EmailVerification',
    components: {
        Email: Email_1.Email,
        BodyText: BodyText_1.BodyText,
        VerifyNowButton: VerifyNowButton_1.VerifyNowButton,
        EmailTable: EmailTable_1.EmailTable,
    },
    props: {
        name: {
            type: String,
            required: true,
        },
        verificationToken: {
            type: String,
            required: true,
        },
    },
    data() {
        return {};
    },
    computed: {},
};
exports.EmailVerification = EmailVerification;
