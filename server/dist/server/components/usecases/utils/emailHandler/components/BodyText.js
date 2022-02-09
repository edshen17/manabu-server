"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BodyText = void 0;
const Salutation_1 = require("./Salutation");
const Signature_1 = require("./Signature");
const BodyText = {
    template: `
    <mj-column width="100%" padding-top="0px">
      <mj-text>
        <slot/>
      </mj-text>
    </mj-column>
  `,
    name: 'BodyText',
    components: {
        Salutation: Salutation_1.Salutation,
        Signature: Signature_1.Signature,
    },
    props: {},
    data() {
        return {};
    },
    computed: {},
};
exports.BodyText = BodyText;
