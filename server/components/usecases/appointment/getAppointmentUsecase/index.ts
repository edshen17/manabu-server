import cloneDeep from 'clone-deep';
import deepEqual from 'deep-equal';
import { makeAppointmentDbService } from '../../../dataAccess/services/appointment';
import { makeAppointmentParamsValidator } from '../../../validators/appointment/params';
import { makeAppointmentQueryValidator } from '../../../validators/appointment/query';
import { GetAppointmentUsecase } from './getAppointmentUsecase';

const makeGetAppointmentUsecase = new GetAppointmentUsecase().init({
  makeDbService: makeAppointmentDbService,
  makeParamsValidator: makeAppointmentParamsValidator,
  makeQueryValidator: makeAppointmentQueryValidator,
  cloneDeep,
  deepEqual,
});

export { makeGetAppointmentUsecase };
