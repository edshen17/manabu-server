"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InternalNewUser = void 0;
const BodyText_1 = require("../components/BodyText");
const ViewUserProfileButton_1 = require("../components/Buttons/ViewUserProfileButton");
const Email_1 = require("../components/Email");
const EmailTable_1 = require("../components/EmailTable");
const InternalNewUser = {
    template: `
    <email :name="name">
      <body-text>{{ $t("internalNewUser.body", processedUserData) }}</body-text>
      <email-table :rowData="rowData"/>
      <view-user-profile-button :user="user"/>
    </email>
  `,
    name: 'InternalNewUser',
    components: {
        Email: Email_1.Email,
        BodyText: BodyText_1.BodyText,
        EmailTable: EmailTable_1.EmailTable,
        ViewUserProfileButton: ViewUserProfileButton_1.ViewUserProfileButton,
    },
    props: {
        name: {
            type: String,
            required: true,
        },
        user: {
            type: Object,
            required: true,
        },
        userType: {
            type: String,
            required: true,
        },
    },
    data() {
        return {};
    },
    computed: {
        processedUserData: {
            get() {
                const self = this;
                const user = self.user;
                return {
                    userType: user.role,
                };
            },
        },
        rowData: {
            get() {
                const self = this;
                const user = self.user;
                const rowData = [
                    {
                        key: self.$t('common.table.name'),
                        value: user.name,
                    },
                    {
                        key: self.$t('common.table.email'),
                        value: user.email,
                    },
                ];
                return rowData;
            },
        },
    },
};
exports.InternalNewUser = InternalNewUser;
