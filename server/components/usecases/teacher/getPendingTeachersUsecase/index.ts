import cloneDeep from 'clone-deep';
import deepEqual from 'deep-equal';
import { makeTeacherDbService } from '../../../dataAccess/services/teacher';
import { makeBaseParamsValidator } from '../../../validators/base/params';
import { makeTeacherQueryValidator } from '../../../validators/teacher/query';
import { GetPendingTeachersUsecase } from './getPendingTeachersUsecase';

const makeGetPendingTeachersUsecase = new GetPendingTeachersUsecase().init({
  makeDbService: makeTeacherDbService,
  makeParamsValidator: makeBaseParamsValidator,
  makeQueryValidator: makeTeacherQueryValidator,
  cloneDeep,
  deepEqual,
});

export { makeGetPendingTeachersUsecase };
