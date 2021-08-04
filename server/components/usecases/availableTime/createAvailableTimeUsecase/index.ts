import cloneDeep from 'clone-deep';
import { makeBaseParamsValidator } from '../../../validators/base/params';
import { CreateAvailableTimeUsecase } from './createAvailableTimeUsecase';
import { makeBaseQueryValidator } from '../../../validators/base/query';
import { makeAvailableTimeEntity } from '../../../entities/availableTime';
import { makeAvailableTimeDbService } from '../../../dataAccess/services/availableTime';

const makeCreateAvailableTimeUsecase = new CreateAvailableTimeUsecase().init({
  cloneDeep,
  makeParamsValidator: makeBaseParamsValidator,
  makeQueryValidator: makeBaseQueryValidator,
  makeAvailableTimeEntity,
  makeAvailableTimeDbService,
});

export { makeCreateAvailableTimeUsecase };
