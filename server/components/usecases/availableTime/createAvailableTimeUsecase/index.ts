import cloneDeep from 'clone-deep';
import deepEqual from 'deep-equal';
import { makeAvailableTimeDbService } from '../../../dataAccess/services/availableTime';
import { makeAvailableTimeEntity } from '../../../entities/availableTime';
import { makeBaseParamsValidator } from '../../../validators/base/params';
import { makeBaseQueryValidator } from '../../../validators/base/query';
import { makeAvailableTimeConflictHandler } from '../../utils/availableTimeConflictHandler';
import { CreateAvailableTimeUsecase } from './createAvailableTimeUsecase';

const makeCreateAvailableTimeUsecase = new CreateAvailableTimeUsecase().init({
  cloneDeep,
  makeParamsValidator: makeBaseParamsValidator,
  makeQueryValidator: makeBaseQueryValidator,
  makeAvailableTimeEntity,
  makeDbService: makeAvailableTimeDbService,
  deepEqual,
  makeAvailableTimeConflictHandler,
});

export { makeCreateAvailableTimeUsecase };
