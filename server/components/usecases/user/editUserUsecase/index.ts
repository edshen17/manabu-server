import cloneDeep from 'clone-deep';
import deepEqual from 'deep-equal';
import sanitizeHtml from 'sanitize-html';
import { makeUserDbService } from '../../../dataAccess/services/user';
import { makeNGramHandler } from '../../../entities/utils/nGramHandler';
import { makeBaseQueryValidator } from '../../../validators/base/query';
import { makeUserEntityValidator } from '../../../validators/user/entity';
import { makeUserParamsValidator } from '../../../validators/user/params';
import { EditUserUsecase } from './editUserUsecase';

const makeEditUserUsecase = new EditUserUsecase().init({
  makeDbService: makeUserDbService,
  makeQueryValidator: makeBaseQueryValidator,
  makeParamsValidator: makeUserParamsValidator,
  makeEditEntityValidator: makeUserEntityValidator,
  cloneDeep,
  makeNGramHandler,
  deepEqual,
  sanitizeHtml,
});

export { makeEditUserUsecase };
