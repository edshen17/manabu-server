import cloneDeep from 'clone-deep';
import deepEqual from 'deep-equal';
import { makeUserDbService } from '../../../dataAccess/services/user';
import { makeBaseParamsValidator } from '../../../validators/base/params';
import { makeBaseQueryValidator } from '../../../validators/base/query';
// import { makeTeacherQueryValidator } from '../../../validators/teacher/query';
import { GetTeachersUsecase } from './getTeachersUsecase';

const makeGetTeachersUsecase = new GetTeachersUsecase().init({
  makeDbService: makeUserDbService,
  makeParamsValidator: makeBaseParamsValidator,
  makeQueryValidator: makeBaseQueryValidator,
  cloneDeep,
  deepEqual,
});

export { makeGetTeachersUsecase };
