import cloneDeep from 'clone-deep';
import { makeTeacherDbService } from '../../../dataAccess/services/teacher';
import { makeBaseQueryValidator } from '../../../validators/base/query';
import { makeTeacherEntityValidator } from '../../../validators/teacher/entity';
import { makeTeacherParamsValidator } from '../../../validators/teacher/params';
import { EditTeacherUsecase } from './editTeacherUsecase';

const makeEditTeacherUsecase = new EditTeacherUsecase().init({
  makeDbService: makeTeacherDbService,
  makeParamsValidator: makeTeacherParamsValidator,
  makeQueryValidator: makeBaseQueryValidator,
  makeEditEntityValidator: makeTeacherEntityValidator,
  cloneDeep,
});

export { makeEditTeacherUsecase };
