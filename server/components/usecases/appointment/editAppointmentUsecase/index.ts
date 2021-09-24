import cloneDeep from 'clone-deep';
import deepEqual from 'deep-equal';
import { makeAppointmentDbService } from '../../../dataAccess/services/appointment';
import { makeAppointmentEntityValidator } from '../../../validators/appointment/entity';
import { makeAppointmentParamsValidator } from '../../../validators/appointment/params';
import { makeBaseQueryValidator } from '../../../validators/base/query';
import { EditAppointmentUsecase } from './editAppointmentUsecase';

const makeEditAppointmentUsecase = new EditAppointmentUsecase().init({
  cloneDeep,
  makeParamsValidator: makeAppointmentParamsValidator,
  makeQueryValidator: makeBaseQueryValidator,
  makeDbService: makeAppointmentDbService,
  deepEqual,
  makeEditEntityValidator: makeAppointmentEntityValidator,
});

export { makeEditAppointmentUsecase };
