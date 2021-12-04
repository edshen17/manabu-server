import { StringKeyObject } from '../../../../../../types/custom';
import { EmailButton } from './EmailButton';

const VerifyNowButton = {
  template: `
    <email-button v-bind="buttonProps"/>
  `,
  name: 'VerifyNowButton',
  components: {
    EmailButton,
  },
  props: {
    verificationToken: {
      type: String,
      required: true,
    },
  },
  data() {
    return {};
  },
  computed: {
    buttonProps: {
      get(): StringKeyObject {
        const self = this as any;
        return {
          isServerEndpoint: true,
          endpoint: `/users/auth/emailToken/${self.verificationToken}/verify`,
          text: self.$t('common.button.verifyNow'),
          paddingTop: '0px',
        };
      },
    },
  },
};

export { VerifyNowButton };
