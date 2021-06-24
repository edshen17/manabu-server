import { GetUserUsecase } from './getUserUsecase';
import { EditUserUsecase } from './editUserUsecase';
import { makeUserDbService } from '../../dataAccess/services/user';
import { makeMinuteBankDbService } from '../../dataAccess/services/minuteBank';
import { makePackageTransactionDbService } from '../../dataAccess/services/packageTransaction';

const makeGetUserUsecase = new GetUserUsecase().init({ makeUserDbService });

const makeEditUserUsecase = new EditUserUsecase().init({
  makeUserDbService,
  makePackageTransactionDbService,
  makeMinuteBankDbService,
});

export { makeGetUserUsecase, makeEditUserUsecase };
