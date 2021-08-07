import cloneDeep from 'clone-deep';
import { DeleteAvailableTimeUsecase } from './deleteAvailableTimeUsecase';
import { makeBaseQueryValidator } from '../../../validators/base/query';
import { makeAvailableTimeDbService } from '../../../dataAccess/services/availableTime';
import { makeAvailableTimeParamsValidator } from '../../../validators/availableTime/params';
import deepEqual from 'deep-equal';
import { makeAvailableTimeEntityValidator } from '../../../validators/availableTime/entity';

const makeDeleteAvailableTimeUsecase = new DeleteAvailableTimeUsecase().init({
  cloneDeep,
  makeParamsValidator: makeAvailableTimeParamsValidator,
  makeQueryValidator: makeBaseQueryValidator,
  makeDbService: makeAvailableTimeDbService,
  deepEqual,
  makeDeleteEntityValidator: makeAvailableTimeEntityValidator,
});

export { makeDeleteAvailableTimeUsecase };
