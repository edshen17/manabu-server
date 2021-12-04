import { BodyText } from '../components/BodyText';
import { VerifyNowButton } from '../components/Buttons/VerifyNowButton';
import { Email } from '../components/Email';
import { EmailTable } from '../components/EmailTable';

const EmailVerification = {
  template: `
    <email :name="name">
      <body-text>{{ $t("emailVerification.body") }}</body-text>
      <verify-now-button :verificationToken="verificationToken"/>
    </email>
  `,
  name: 'EmailVerification',
  components: {
    Email,
    BodyText,
    VerifyNowButton,
    EmailTable,
  },
  props: {
    name: {
      type: String,
      required: true,
    },
    verificationToken: {
      type: String,
      required: true,
    },
  },
  data() {
    return {};
  },
  computed: {},
};

export { EmailVerification };
