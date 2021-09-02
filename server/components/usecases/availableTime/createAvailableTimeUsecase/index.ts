import cloneDeep from 'clone-deep';
import deepEqual from 'deep-equal';
import { makeAvailableTimeDbService } from '../../../dataAccess/services/availableTime';
import { makeAvailableTimeEntity } from '../../../entities/availableTime';
import { convertStringToObjectId } from '../../../entities/utils/convertStringToObjectId';
import { makeBaseParamsValidator } from '../../../validators/base/params';
import { makeBaseQueryValidator } from '../../../validators/base/query';
import { CreateAvailableTimeUsecase } from './createAvailableTimeUsecase';

const makeCreateAvailableTimeUsecase = new CreateAvailableTimeUsecase().init({
  cloneDeep,
  makeParamsValidator: makeBaseParamsValidator,
  makeQueryValidator: makeBaseQueryValidator,
  makeAvailableTimeEntity,
  makeDbService: makeAvailableTimeDbService,
  deepEqual,
  convertStringToObjectId,
});

export { makeCreateAvailableTimeUsecase };
