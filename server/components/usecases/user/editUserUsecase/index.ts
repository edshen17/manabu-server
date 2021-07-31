import cloneDeep from 'clone-deep';
import { makeUserDbService } from '../../../dataAccess/services/user';
import { createEdgeNGrams } from '../../../entities/utils/createEdgeNGrams';
import { makeBaseQueryValidator } from '../../../validators/base/query';
import { makeUserEntityValidator } from '../../../validators/user/entity';
import { makeUserParamsValidator } from '../../../validators/user/params';
import { EditUserUsecase } from './editUserUsecase';

const makeEditUserUsecase = new EditUserUsecase().init({
  makeUserDbService,
  makeQueryValidator: makeBaseQueryValidator,
  makeParamsValidator: makeUserParamsValidator,
  makeEditEntityValidator: makeUserEntityValidator,
  cloneDeep,
  createEdgeNGrams,
});

export { makeEditUserUsecase };
