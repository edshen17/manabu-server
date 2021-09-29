import cloneDeep from 'clone-deep';
import deepEqual from 'deep-equal';
import { makePackageTransactionDbService } from '../../../dataAccess/services/packageTransaction';
import { makeAppointmentParamsValidator } from '../../../validators/appointment/params';
import { makeAppointmentQueryValidator } from '../../../validators/appointment/query';

const makeGetPackageTransactionUsecase = new GetPackageTransactionUsecase().init({
  makeDbService: makePackageTransactionDbService,
  makeParamsValidator: makeAppointmentParamsValidator,
  makeQueryValidator: makeAppointmentQueryValidator,
  cloneDeep,
  deepEqual,
});

export { makeGetPackageTransactionUsecase };
