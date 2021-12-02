const EmailTable = {
  template: `
    <mj-section>
      <mj-column v-for="row in rowData" :key="row.key" width="100%" background-color="#F3F9FF" 
        padding-top="0px" padding-bottom="18px">
        <mj-text mj-class="table-text">
          <span>
            <mj-text><b>{{ row.key }}</b>{{ $t("common.table.colon") }}</mj-text> {{ row.value }}
          </span>
        </mj-text>
      </mj-column>
    </mj-section>
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

export { EmailTable };
