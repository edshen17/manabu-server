"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailTable = void 0;
const EmailTable = {
    template: `
    <mj-column width="100%" background-color="#F3F9FF" padding-top="0px">
      <mj-text mj-class="table-text" v-for="row in rowData" :key="row.key">
        <span>
          <mj-text><b>{{ row.key }}</b>{{ $t("common.table.colon") }}</mj-text> {{ row.value }}
        </span>
      </mj-text>
    </mj-column>
  `,
    name: 'EmailTable',
    components: {},
    props: {
        rowData: {
            type: Array,
            default: [],
            required: true,
        },
    },
    data() {
        return {};
    },
    computed: {},
};
exports.EmailTable = EmailTable;
