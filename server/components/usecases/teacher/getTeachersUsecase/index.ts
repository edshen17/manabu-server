import cloneDeep from 'clone-deep';
import { GetTeachersUsecase } from './getTeachersUsecase';
import { makeUserDbService } from '../../../dataAccess/services/user';
import { makeBaseParamsValidator } from '../../../validators/base/params';
import { makeTeacherQueryValidator } from '../../../validators/teacher/query';
import deepEqual from 'deep-equal';

const makeGetTeachersUsecase = new GetTeachersUsecase().init({
  makeDbService: makeUserDbService,
  makeParamsValidator: makeBaseParamsValidator,
  makeQueryValidator: makeTeacherQueryValidator,
  cloneDeep,
  deepEqual,
});

export { makeGetTeachersUsecase };
