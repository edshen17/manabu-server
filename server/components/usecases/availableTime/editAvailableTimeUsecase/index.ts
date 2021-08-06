import cloneDeep from 'clone-deep';
import { EditAvailableTimeUsecase } from './editAvailableTimeUsecase';
import { makeBaseQueryValidator } from '../../../validators/base/query';
import { makeAvailableTimeDbService } from '../../../dataAccess/services/availableTime';
import { makeAvailableTimeParamsValidator } from '../../../validators/availableTime/params';
import deepEqual from 'deep-equal';
import { makeAvailableTimeEntityValidator } from '../../../validators/availableTime/entity';

const makeEditAvailableTimeUsecase = new EditAvailableTimeUsecase().init({
  cloneDeep,
  makeParamsValidator: makeAvailableTimeParamsValidator,
  makeQueryValidator: makeBaseQueryValidator,
  makeDbService: makeAvailableTimeDbService,
  deepEqual,
  makeEditEntityValidator: makeAvailableTimeEntityValidator,
});

export { makeEditAvailableTimeUsecase };
