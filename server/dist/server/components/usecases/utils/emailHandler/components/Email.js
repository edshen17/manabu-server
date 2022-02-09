"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Email = void 0;
const EmailBody_1 = require("./EmailBody");
const EmailHead_1 = require("./EmailHead");
const Logo_1 = require("./Logo");
const Social_1 = require("./Social");
const Email = {
    template: `
     <mjml>
      <email-head/>
      <mj-body>
        <logo/>
        <email-body :name="name">
          <slot/>
        </email-body>
        <social/>
      </mj-body>
    </mjml>
  `,
    name: 'Email',
    components: {
        EmailHead: EmailHead_1.EmailHead,
        Logo: Logo_1.Logo,
        EmailBody: EmailBody_1.EmailBody,
        Social: Social_1.Social,
    },
    props: {
        name: { type: String, required: true },
    },
    data() {
        return {};
    },
    computed: {},
};
exports.Email = Email;
