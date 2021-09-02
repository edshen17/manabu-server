import cloneDeep from 'clone-deep';
import deepEqual from 'deep-equal';
import { makeAvailableTimeDbService } from '../../../dataAccess/services/availableTime';
import { makeAvailableTimeEntityValidator } from '../../../validators/availableTime/entity';
import { makeAvailableTimeParamsValidator } from '../../../validators/availableTime/params';
import { makeBaseQueryValidator } from '../../../validators/base/query';
import { DeleteAvailableTimeUsecase } from './deleteAvailableTimeUsecase';

const makeDeleteAvailableTimeUsecase = new DeleteAvailableTimeUsecase().init({
  cloneDeep,
  makeParamsValidator: makeAvailableTimeParamsValidator,
  makeQueryValidator: makeBaseQueryValidator,
  makeDbService: makeAvailableTimeDbService,
  deepEqual,
  makeDeleteEntityValidator: makeAvailableTimeEntityValidator,
});

export { makeDeleteAvailableTimeUsecase };
