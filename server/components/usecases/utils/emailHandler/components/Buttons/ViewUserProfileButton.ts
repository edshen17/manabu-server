import { StringKeyObject } from '../../../../../../types/custom';
import { EmailButton } from './EmailButton';

const ViewUserProfileButton = {
  template: `
    <email-button v-bind="buttonProps"/>
  `,
  name: 'ViewUserProfileButton',
  components: {
    EmailButton,
  },
  props: {
    user: {
      type: Object,
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
          endpoint: `/user/${self.user._id}`,
          text: self.$t('common.button.viewUserProfile'),
        };
      },
    },
  },
};

export { ViewUserProfileButton };
