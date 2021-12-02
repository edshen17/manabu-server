import { EmailBody } from './EmailBody';
import { EmailHead } from './EmailHead';
import { Logo } from './Logo';
import { Social } from './Social';

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
    EmailHead,
    Logo,
    EmailBody,
    Social,
  },
  props: {
    name: { type: String, required: true },
  },
  data() {
    return {};
  },
  computed: {},
};

export { Email };
