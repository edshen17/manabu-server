import cloneDeep from 'clone-deep';
import dayjs from 'dayjs';
import deepEqual from 'deep-equal';
import { makeAppointmentDbService } from '../../../dataAccess/services/appointment';
import { makeAppointmentQueryValidator } from '../../../validators/appointment/query';
import { makeUserParamsValidator } from '../../../validators/user/params';
import { GetAppointmentsUsecase } from './getAppointmentsUsecase';

const makeGetAppointmentsUsecase = new GetAppointmentsUsecase().init({
  makeDbService: makeAppointmentDbService,
  makeParamsValidator: makeUserParamsValidator,
  makeQueryValidator: makeAppointmentQueryValidator,
  cloneDeep,
  deepEqual,
  dayjs,
});

export { makeGetAppointmentsUsecase };
