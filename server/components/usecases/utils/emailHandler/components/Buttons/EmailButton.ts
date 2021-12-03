import { makeRedirectUrlBuilder } from '../../../redirectUrlBuilder';

const redirectUrlBuilder = makeRedirectUrlBuilder;
const EmailButton = {
  template: `
    <mj-column width="100%" padding-top="24px">
      <mj-button :href="href"
        padding="20px" background-color="#2294ed">
          {{ text }}
      </mj-button>
    </mj-column>
  `,
  name: 'EmailButton',
  components: {},
  props: {
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
      get(): string {
        const href = redirectUrlBuilder
          .host('client')
          .endpoint((this as any).endpoint)
          .build();
        return href;
      },
    },
  },
};

export { EmailButton };
