const Signature = {
  template: `
    <mj-column width="100%" padding-top="0px" padding-bottom="0px">
      <mj-text>
        <i18next path="common.footer.contact" tag="label">
          <a href="mailto:support@manabu.sg">support@manabu.sg</a>
        </i18next>
      </mj-text>
      <mj-text>{{ $t("common.footer.sincerely") }}</mj-text>
      <mj-text padding-top="0px" padding-bottom="30px">{{ $t("common.footer.manabuTeam") }}</mj-text>
    </mj-column>
  `,
  name: 'Signature',
  components: {},
  props: {},
  data() {
    return {};
  },
  computed: {},
};

export { Signature };
