import cloneDeep from 'clone-deep';
import dayjs from 'dayjs';
import deepEqual from 'deep-equal';
import { makeAvailableTimeDbService } from '../../../dataAccess/services/availableTime';
import { makeAvailableTimeQueryValidator } from '../../../validators/availableTime/query';
import { makeUserParamsValidator } from '../../../validators/user/params';
import { GetAvailableTimesUsecase } from './getAvailableTimesUsecase';

const makeGetAvailableTimesUsecase = new GetAvailableTimesUsecase().init({
  makeDbService: makeAvailableTimeDbService,
  makeParamsValidator: makeUserParamsValidator,
  makeQueryValidator: makeAvailableTimeQueryValidator,
  cloneDeep,
  deepEqual,
  dayjs,
});

export { makeGetAvailableTimesUsecase };
