import { makeRedirectUrlBuilder } from '../../../redirectUrlBuilder';

const redirectUrlBuilder = makeRedirectUrlBuilder;
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
      get(): string {
        const host = (this as any).isServerEndpoint ? 'server' : 'client';
        const href = redirectUrlBuilder
          .host(host)
          .endpoint((this as any).endpoint)
          .build();
        return href;
      },
    },
  },
};

export { EmailButton };
