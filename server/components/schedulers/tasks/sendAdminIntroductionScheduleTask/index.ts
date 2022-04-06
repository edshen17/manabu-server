import dayjs from 'dayjs';
import { makeCacheDbService } from '../../../dataAccess/services/cache';
import { makeUserDbService } from '../../../dataAccess/services/user';
import { makeEmailHandler } from '../../../usecases/utils/emailHandler';
import { SendAdminIntroductionScheduleTask } from './sendAdminIntroductionScheduleTask';

const makeSendAdminIntroductionScheduleTask = new SendAdminIntroductionScheduleTask().init({
  dayjs,
  makeUserDbService,
  makeCacheDbService,
  makeEmailHandler,
});

export { makeSendAdminIntroductionScheduleTask };
