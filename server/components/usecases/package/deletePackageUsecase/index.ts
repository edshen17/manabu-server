import cloneDeep from 'clone-deep';
import deepEqual from 'deep-equal';
import { makePackageDbService } from '../../../dataAccess/services/package';
import { makeBaseQueryValidator } from '../../../validators/base/query';
import { makePackageEntityValidator } from '../../../validators/package/entity';
import { makePackageParamsValidator } from '../../../validators/package/params';
import { DeletePackageUsecase } from './deletePackageUsecase';

const makeDeletePackageUsecase = new DeletePackageUsecase().init({
  cloneDeep,
  makeParamsValidator: makePackageParamsValidator,
  makeQueryValidator: makeBaseQueryValidator,
  makeDbService: makePackageDbService,
  deepEqual,
  makeDeleteEntityValidator: makePackageEntityValidator,
});

export { makeDeletePackageUsecase };
