import { makeUserDbService } from '../../../dataAccess/services/user';
import { makeBaseQueryValidator } from '../../../validators/base/query';
import { makeUserEntityValidator } from '../../../validators/user/entity';
import { makeUserParamsValidator } from '../../../validators/user/params';
import { EditUserUsecase } from './editUserUsecase';

const makeEditUserUsecase = new EditUserUsecase().init({
  makeUserDbService,
  makeQueryValidator: makeBaseQueryValidator,
  makeParamsValidator: makeUserParamsValidator,
  makeEditEntityValidator: makeUserEntityValidator,
});

export { makeEditUserUsecase };
