import cloneDeep from 'clone-deep';
import deepEqual from 'deep-equal';
import { makeBaseParamsValidator } from '../../../validators/base/params';
import { CreateAppointmentsUsecase } from './createAppointmentsUsecase';
import { makeBaseQueryValidator } from '../../../validators/base/query';
import { makeAppointmentDbService } from '../../../dataAccess/services/appointment';
import { makeAppointmentEntity } from '../../../entities/appointment';
import { makePackageTransactionDbService } from '../../../dataAccess/services/packageTransaction';
import { makeSplitAvailableTimeHandler } from '../../utils/splitAvailableTimeHandler';

const makeCreateAppointmentsUsecase = new CreateAppointmentsUsecase().init({
  cloneDeep,
  makeParamsValidator: makeBaseParamsValidator,
  makeQueryValidator: makeBaseQueryValidator,
  makeAppointmentEntity,
  makeDbService: makeAppointmentDbService,
  deepEqual,
  makePackageTransactionDbService,
  makeSplitAvailableTimeHandler,
});

export { makeCreateAppointmentsUsecase };
