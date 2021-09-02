import cloneDeep from 'clone-deep';
import dayjs from 'dayjs';
import deepEqual from 'deep-equal';
import { makeAppointmentDbService } from '../../../dataAccess/services/appointment';
import { makeAvailableTimeDbService } from '../../../dataAccess/services/availableTime';
import { makePackageTransactionDbService } from '../../../dataAccess/services/packageTransaction';
import { makeAppointmentEntity } from '../../../entities/appointment';
import { makeBaseParamsValidator } from '../../../validators/base/params';
import { makeBaseQueryValidator } from '../../../validators/base/query';
import { makeEmailHandler } from '../../utils/emailHandler';
import { makeSplitAvailableTimeHandler } from '../../utils/splitAvailableTimeHandler';
import { CreateAppointmentsUsecase } from './createAppointmentsUsecase';

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
