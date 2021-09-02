import cloneDeep from 'clone-deep';
import deepEqual from 'deep-equal';
import { makeUserDbService } from '../../../dataAccess/services/user';
import { makeBaseParamsValidator } from '../../../validators/base/params';
import { makeTeacherQueryValidator } from '../../../validators/teacher/query';
import { GetTeachersUsecase } from './getTeachersUsecase';

const makeGetTeachersUsecase = new GetTeachersUsecase().init({
  makeDbService: makeUserDbService,
  makeParamsValidator: makeBaseParamsValidator,
  makeQueryValidator: makeTeacherQueryValidator,
  cloneDeep,
  deepEqual,
});

export { makeGetTeachersUsecase };
