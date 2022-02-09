"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailBody = void 0;
const Salutation_1 = require("./Salutation");
const Signature_1 = require("./Signature");
const EmailBody = {
    template: `
    <mj-section>
      <salutation :name="name" />
      <slot/>
      <signature />
    </mj-section>
  `,
    name: 'EmailBody',
    components: {
        Salutation: Salutation_1.Salutation,
        Signature: Signature_1.Signature,
    },
    props: {
        name: { type: String, required: true },
    },
    data() {
        return {};
    },
    computed: {},
};
exports.EmailBody = EmailBody;
