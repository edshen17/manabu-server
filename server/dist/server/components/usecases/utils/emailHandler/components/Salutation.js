"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Salutation = void 0;
const Salutation = {
    template: `
    <mj-column background-color="#fff" css-class="body-section" 
      border-top="4px solid #2294ed" width="100%" padding-bottom="0px">
      <mj-text>{{ $t("common.header.dear", { name }) }}</mj-text>
    </mj-column>
  `,
    name: 'Salutation',
    components: {},
    props: {
        name: { type: String, required: true },
    },
    data() {
        return {};
    },
    computed: {},
};
exports.Salutation = Salutation;
