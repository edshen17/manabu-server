"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailButton = void 0;
const redirectUrlBuilder_1 = require("../../../redirectUrlBuilder");
const redirectUrlBuilder = redirectUrlBuilder_1.makeRedirectUrlBuilder;
const EmailButton = {
    template: `
    <mj-column width="100%" :padding-top="paddingTop">
      <mj-button :href="href"
        padding="20px" background-color="#2294ed">
          {{ text }}
      </mj-button>
    </mj-column>
  `,
    name: 'EmailButton',
    components: {},
    props: {
        paddingTop: {
            type: String,
            required: false,
            default: '24px',
        },
        isServerEndpoint: {
            type: Boolean,
            required: false,
            default: false,
        },
        endpoint: {
            type: String,
            required: true,
        },
        text: {
            type: String,
            required: true,
        },
    },
    data() {
        return {};
    },
    computed: {
        href: {
            get() {
                const host = this.isServerEndpoint ? 'server' : 'client';
                const href = redirectUrlBuilder
                    .host(host)
                    .endpoint(this.endpoint)
                    .build();
                return href;
            },
        },
    },
};
exports.EmailButton = EmailButton;
