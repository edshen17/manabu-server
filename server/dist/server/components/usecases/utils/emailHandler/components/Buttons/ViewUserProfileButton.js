"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ViewUserProfileButton = void 0;
const EmailButton_1 = require("./EmailButton");
const ViewUserProfileButton = {
    template: `
    <email-button v-bind="buttonProps"/>
  `,
    name: 'ViewUserProfileButton',
    components: {
        EmailButton: EmailButton_1.EmailButton,
    },
    props: {
        user: {
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
                const self = this;
                return {
                    endpoint: `/user/${self.user._id}`,
                    text: self.$t('common.button.viewUserProfile'),
                };
            },
        },
    },
};
exports.ViewUserProfileButton = ViewUserProfileButton;
