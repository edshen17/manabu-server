import cloneDeep from 'clone-deep';
import deepEqual from 'deep-equal';
import dayjs from 'dayjs';
import { makeBaseParamsValidator } from '../../../validators/base/params';
import { CreateAppointmentsUsecase } from './createAppointmentsUsecase';
import { makeBaseQueryValidator } from '../../../validators/base/query';
import { makeAppointmentDbService } from '../../../dataAccess/services/appointment';
import { makeAppointmentEntity } from '../../../entities/appointment';
import { makePackageTransactionDbService } from '../../../dataAccess/services/packageTransaction';
import { makeSplitAvailableTimeHandler } from '../../utils/splitAvailableTimeHandler';
import { makeAvailableTimeDbService } from '../../../dataAccess/services/availableTime';
import { makeEmailHandler } from '../../utils/emailHandler';

const makeCreateAppointmentsUsecase = new CreateAppointmentsUsecase().init({
  cloneDeep,
  makeParamsValidator: makeBaseParamsValidator,
  makeQueryValidator: makeBaseQueryValidator,
  makeAppointmentEntity,
  makeDbService: makeAppointmentDbService,
  deepEqual,
  makePackageTransactionDbService,
  makeSplitAvailableTimeHandler,
  dayjs,
  makeAvailableTimeDbService,
  makeEmailHandler,
});

export { makeCreateAppointmentsUsecase };
