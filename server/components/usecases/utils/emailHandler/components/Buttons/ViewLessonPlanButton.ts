import { StringKeyObject } from '../../../../../../types/custom';
import { EmailButton } from './EmailButton';

const ViewLessonPlanButton = {
  template: `
    <email-button v-bind="buttonProps"/>
  `,
  name: 'ViewLessonPlanButton',
  components: {
    EmailButton,
  },
  props: {
    packageTransaction: {
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
        const packageTransactionId = (this as any).packageTransaction._id;
        return {
          endpoint: `/packageTransaction/${packageTransactionId}`,
          text: (this as any).$t('common.button.viewLessonPlan'),
        };
      },
    },
  },
};

export { ViewLessonPlanButton };
