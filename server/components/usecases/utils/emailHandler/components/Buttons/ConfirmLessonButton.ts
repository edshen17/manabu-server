import { StringKeyObject } from '../../../../../../types/custom';
import { EmailButton } from './EmailButton';

const ConfirmLessonButton = {
  template: `
    <email-button v-bind="buttonProps"/>
  `,
  name: 'ConfirmLessonButton',
  components: {
    EmailButton,
  },
  props: {
    appointment: {
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
        const appointmentId = (this as any).appointment._id;
        return {
          endpoint: `/appointments/${appointmentId}`,
          text: (this as any).$t('common.button.confirmLesson'),
        };
      },
    },
  },
};

export { ConfirmLessonButton };
