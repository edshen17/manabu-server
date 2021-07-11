import { makeUserDbService } from '../../dataAccess/services/user';
import { PackageEntity } from './packageEntity';
import { makePackageEntityValidator } from './validators';

const makePackageEntity = new PackageEntity().init({
  makeUserDbService,
  makeEntityValidator: makePackageEntityValidator,
});

export { makePackageEntity };
