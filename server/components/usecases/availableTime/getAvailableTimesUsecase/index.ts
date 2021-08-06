import cloneDeep from 'clone-deep';
import { GetAvailableTimesUsecase } from './getAvailableTimesUsecase';
import deepEqual from 'deep-equal';
import { makeAvailableTimeDbService } from '../../../dataAccess/services/availableTime';
import dayjs from 'dayjs';
import { makeUserParamsValidator } from '../../../validators/user/params';
import { makeAvailableTimeQueryValidator } from '../../../validators/availableTime/query';

const makeGetAvailableTimesUsecase = new GetAvailableTimesUsecase().init({
  makeDbService: makeAvailableTimeDbService,
  makeParamsValidator: makeUserParamsValidator,
  makeQueryValidator: makeAvailableTimeQueryValidator,
  cloneDeep,
  deepEqual,
  dayjs,
});

export { makeGetAvailableTimesUsecase };
