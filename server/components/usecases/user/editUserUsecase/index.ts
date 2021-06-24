import { makeMinuteBankDbService } from '../../../dataAccess/services/minuteBank';
import { makePackageTransactionDbService } from '../../../dataAccess/services/packageTransaction';
import { makeUserDbService } from '../../../dataAccess/services/user';
import { EditUserUsecase } from './editUserUsecase';

const makeEditUserUsecase = new EditUserUsecase().init({
  makeUserDbService,
  makePackageTransactionDbService,
  makeMinuteBankDbService,
});

export { makeEditUserUsecase };
