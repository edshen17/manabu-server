import cloneDeep from 'clone-deep';
import { GetTeachersUsecase } from './getTeachersUsecase';
import { makeUserDbService } from '../../../dataAccess/services/user';
import { makeBaseParamsValidator } from '../../../validators/base/params';
import { makeTeacherQueryValidator } from '../../../validators/teacher/query';

const makeGetTeachersUsecase = new GetTeachersUsecase().init({
  makeUserDbService,
  makeParamsValidator: makeBaseParamsValidator,
  makeQueryValidator: makeTeacherQueryValidator,
  cloneDeep,
});

export { makeGetTeachersUsecase };
