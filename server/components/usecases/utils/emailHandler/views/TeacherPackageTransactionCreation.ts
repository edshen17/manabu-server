import { BalanceTransactionDoc } from '../../../../../models/BalanceTransaction';
import { PackageDoc } from '../../../../../models/Package';
import { PackageTransactionDoc } from '../../../../../models/PackageTransaction';
import { StringKeyObject } from '../../../../../types/custom';
import { convertToTitlecase } from '../../convertToTitlecase';
import { BodyText } from '../components/BodyText';
import { ViewLessonPlanButton } from '../components/Buttons/ViewLessonPlanButton';
import { Email } from '../components/Email';
import { EmailTable } from '../components/EmailTable';

const TeacherPackageTransactionCreation = {
  template: `
    <email :name="name">
      <body-text>{{ $t("teacherPackageTransactionCreation.body", processedPackageTransactionData) }}</body-text>
      <email-table :rowData="rowData"/>
      <view-lesson-plan-button :packageTransaction="packageTransaction"/>
    </email>
  `,
  name: 'TeacherPackageTransactionCreation',
  components: {
    Email,
    BodyText,
    EmailTable,
    ViewLessonPlanButton,
  },
  props: {
    name: {
      type: String,
      required: true,
    },
    balanceTransaction: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {};
  },
  computed: {
    processedPackageTransactionData: {
      get(): StringKeyObject {
        const balanceTransaction: BalanceTransactionDoc = (this as any).balanceTransaction;
        const packageTransaction: PackageTransactionDoc = balanceTransaction.packageTransactionData;
        return {
          studentName: packageTransaction.reservedByData.name,
        };
      },
    },
    rowData: {
      get(): StringKeyObject[] {
        const self = this as any;
        const balanceTransaction: BalanceTransactionDoc = (this as any).balanceTransaction;
        const packageTransaction: PackageTransactionDoc = balanceTransaction.packageTransactionData;
        const pkg: PackageDoc = packageTransaction.packageData;
        const rowData = [
          {
            key: self.$t('common.table.studentName'),
            value: packageTransaction.reservedByData.name,
          },
          {
            key: self.$t('common.table.lessonPlan'),
            value: convertToTitlecase(pkg.name),
          },
          {
            key: self.$t('common.table.lessonDetails'),
            value: `${pkg.lessonAmount} x ${packageTransaction.lessonDuration} min lessons`,
          },
          {
            key: self.$t('common.table.terminationDate'),
            value: packageTransaction.terminationDate,
          },
          {
            key: self.$t('common.table.totalPrice'),
            value: `${balanceTransaction.totalPayment} ${balanceTransaction.currency}`,
          },
        ];
        return rowData;
      },
    },
    packageTransaction: {
      get(): PackageTransactionDoc {
        const packageTransaction = (this as any).balanceTransaction.packageTransactionData;
        return packageTransaction;
      },
    },
  },
};

export { TeacherPackageTransactionCreation };
