import { StringKeyObject } from '../../../../../../types/custom';
import { EmailButton } from './EmailButton';

const ViewLessonButton = {
  template: `
    <email-button v-bind="buttonProps"/>
  `,
  name: 'ViewLessonButton',
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
          endpoint: `/appointment/${appointmentId}`,
          text: (this as any).$t('common.button.viewLesson'),
        };
      },
    },
  },
};

export { ViewLessonButton };
