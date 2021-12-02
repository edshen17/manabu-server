import { Salutation } from './Salutation';
import { Signature } from './Signature';

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
    Salutation,
    Signature,
  },
  props: {
    name: { type: String, required: true },
  },
  data() {
    return {};
  },
  computed: {},
};

export { EmailBody };
