import cloneDeep from 'clone-deep';
import deepEqual from 'deep-equal';
import { makePackageDbService } from '../../../dataAccess/services/package';
import { makeBaseQueryValidator } from '../../../validators/base/query';
import { makePackageEntityValidator } from '../../../validators/package/entity';
import { makePackageParamsValidator } from '../../../validators/package/params';
import { EditPackageUsecase } from './editPackageUsecase';

const makeEditPackageUsecase = new EditPackageUsecase().init({
  cloneDeep,
  makeParamsValidator: makePackageParamsValidator,
  makeQueryValidator: makeBaseQueryValidator,
  makeDbService: makePackageDbService,
  deepEqual,
  makeEditEntityValidator: makePackageEntityValidator,
});

export { makeEditPackageUsecase };
