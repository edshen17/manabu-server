import { TEACHER_EMAIL_ALERT_NAME } from '../../../../../models/Teacher';
import { USER_EMAIL_ALERT_NAME } from '../../../../../models/User';

enum _EMAIL_TEMPLATE_NAME {
  INTERNAL = 'internalNewSignUp',
  EMAIL_VERIFICATION = 'emailVerification',
}

const EMAIL_TEMPLATE_NAME = {
  ..._EMAIL_TEMPLATE_NAME,
  ...TEACHER_EMAIL_ALERT_NAME,
  ...USER_EMAIL_ALERT_NAME,
};

export { EMAIL_TEMPLATE_NAME };
