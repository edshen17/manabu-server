import { BodyText } from '../components/BodyText';
import { Email } from '../components/Email';

const TeacherAppointmentCreation = {
  template: `
    <email :name="name">
      <body-text>some text</body-text>
    </email>
  `,
  name: 'TeacherAppointmentCreation',
  components: {
    Email,
    BodyText,
  },
  props: {
    name: {
      type: String,
      required: true,
    },
  },
  data() {
    return {};
  },
  computed: {},
};

export { TeacherAppointmentCreation };
