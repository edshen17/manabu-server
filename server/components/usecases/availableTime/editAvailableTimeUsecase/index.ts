import cloneDeep from 'clone-deep';
import deepEqual from 'deep-equal';
import { makeAvailableTimeDbService } from '../../../dataAccess/services/availableTime';
import { makeAvailableTimeEntityValidator } from '../../../validators/availableTime/entity';
import { makeAvailableTimeParamsValidator } from '../../../validators/availableTime/params';
import { makeBaseQueryValidator } from '../../../validators/base/query';
import { EditAvailableTimeUsecase } from './editAvailableTimeUsecase';

const makeEditAvailableTimeUsecase = new EditAvailableTimeUsecase().init({
  cloneDeep,
  makeParamsValidator: makeAvailableTimeParamsValidator,
  makeQueryValidator: makeBaseQueryValidator,
  makeDbService: makeAvailableTimeDbService,
  deepEqual,
  makeEditEntityValidator: makeAvailableTimeEntityValidator,
});

export { makeEditAvailableTimeUsecase };
