import cloneDeep from 'clone-deep';
import deepEqual from 'deep-equal';
import { makeTeacherDbService } from '../../../dataAccess/services/teacher';
import { makePackageEntity } from '../../../entities/package';
import { makeBaseParamsValidator } from '../../../validators/base/params';
import { makeBaseQueryValidator } from '../../../validators/base/query';
import { CreatePackagesUsecase } from './createPackagesUsecase';

const makeCreatePackagesUsecase = new CreatePackagesUsecase().init({
  cloneDeep,
  makeParamsValidator: makeBaseParamsValidator,
  makeQueryValidator: makeBaseQueryValidator,
  makeDbService: makeTeacherDbService,
  makePackageEntity,
  deepEqual,
});

export { makeCreatePackagesUsecase };
