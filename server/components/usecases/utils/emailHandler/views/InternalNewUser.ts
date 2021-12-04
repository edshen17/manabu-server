import { JoinedUserDoc } from '../../../../../models/User';
import { StringKeyObject } from '../../../../../types/custom';
import { BodyText } from '../components/BodyText';
import { ViewUserProfileButton } from '../components/Buttons/ViewUserProfileButton';
import { Email } from '../components/Email';
import { EmailTable } from '../components/EmailTable';

const InternalNewUser = {
  template: `
    <email :name="name">
      <body-text>{{ $t("internalNewUser.body", processedUserData) }}</body-text>
      <email-table :rowData="rowData"/>
      <view-user-profile-button :user="user"/>
    </email>
  `,
  name: 'InternalNewUser',
  components: {
    Email,
    BodyText,
    EmailTable,
    ViewUserProfileButton,
  },
  props: {
    name: {
      type: String,
      required: true,
    },
    user: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {};
  },
  computed: {
    processedUserData: {
      get(): StringKeyObject {
        const self = this as any;
        const user = self.user;
        return {
          userType: user.role,
        };
      },
    },
    rowData: {
      get(): StringKeyObject[] {
        const self = this as any;
        const user: JoinedUserDoc = self.user;
        const rowData = [
          {
            key: self.$t('common.table.name'),
            value: user.name,
          },
          {
            key: self.$t('common.table.email'),
            value: user.email,
          },
        ];
        return rowData;
      },
    },
  },
};

export { InternalNewUser };
