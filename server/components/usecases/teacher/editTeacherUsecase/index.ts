import { makeTeacherDbService } from '../../../dataAccess/services/teacher';
import { makeUserDbService } from '../../../dataAccess/services/user';
import { makeBaseQueryValidator } from '../../../validators/base/query';
import { makeTeacherEntityValidator } from '../../../validators/teacher/entity';
import { makeUserParamsValidator } from '../../../validators/user/params';
import { EditTeacherUsecase } from './editTeacherUsecase';

const makeEditTeacherUsecase = new EditTeacherUsecase().init({
  makeUserDbService,
  makeTeacherDbService,
  makeParamsValidator: makeUserParamsValidator,
  makeQueryValidator: makeBaseQueryValidator,
  makeEditEntityValidator: makeTeacherEntityValidator,
});

export { makeEditTeacherUsecase };
