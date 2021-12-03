import { Salutation } from './Salutation';
import { Signature } from './Signature';

const BodyText = {
  template: `
    <mj-column width="100%" padding-top="0px" padding-bottom="18px">
      <mj-text>
        <slot/>
      </mj-text>
    </mj-column>
  `,
  name: 'BodyText',
  components: {
    Salutation,
    Signature,
  },
  props: {},
  data() {
    return {};
  },
  computed: {},
};

export { BodyText };
