import { AppointmentDoc } from '../../../../../models/Appointment';
import { PackageDoc } from '../../../../../models/Package';
import { PackageTransactionDoc } from '../../../../../models/PackageTransaction';
import { StringKeyObject } from '../../../../../types/custom';
import { convertToTitlecase } from '../../convertToTitlecase';
import { BodyText } from '../components/BodyText';
import { ViewLessonButton } from '../components/Buttons/ViewLessonButton';
import { Email } from '../components/Email';
import { EmailTable } from '../components/EmailTable';

const StudentAppointmentReminder = {
  template: `
    <email :name="name">
      <body-text>{{ $t("studentAppointmentReminder.body", processedAppointmentData) }}</body-text>
      <email-table :rowData="rowData"/>
      <view-lesson-button :appointment="appointment"/>
    </email>
  `,
  name: 'StudentAppointmentReminder',
  components: {
    Email,
    BodyText,
    ViewLessonButton,
    EmailTable,
  },
  props: {
    name: {
      type: String,
      required: true,
    },
    appointment: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {};
  },
  computed: {
    processedAppointmentData: {
      get(): StringKeyObject {
        const appointment: AppointmentDoc = (this as any).appointment;
        const packageTransaction: PackageTransactionDoc = appointment.packageTransactionData;
        return {
          teacherName: packageTransaction.hostedByData.name,
        };
      },
    },
    rowData: {
      get(): StringKeyObject[] {
        const self = this as any;
        const appointment: AppointmentDoc = (this as any).appointment;
        const packageTransaction: PackageTransactionDoc = appointment.packageTransactionData;
        const pkg: PackageDoc = packageTransaction.packageData;
        const rowData = [
          {
            key: self.$t('common.table.teacherName'),
            value: packageTransaction.hostedByData.name,
          },
          {
            key: self.$t('common.table.lessonPlan'),
            value: convertToTitlecase(pkg.packageName),
          },
          {
            key: self.$t('common.table.lessonDetails'),
            value: `${pkg.lessonAmount} x ${packageTransaction.lessonDuration} min lessons`,
          },
          {
            key: self.$t('common.table.lessonDate'),
            value: appointment.startDate,
          },
          {
            key: self.$t('common.table.lessonStatus'),
            value: convertToTitlecase(appointment.status),
          },
        ];
        return rowData;
      },
    },
  },
};

export { StudentAppointmentReminder };
