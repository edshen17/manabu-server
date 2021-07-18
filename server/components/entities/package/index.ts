import { makeUserDbService } from '../../dataAccess/services/user';
import { PackageEntity } from './packageEntity';
import { makePackageEntityValidator } from '../../validators/package/entity';

const makePackageEntity = new PackageEntity().init({
  makeEntityValidator: makePackageEntityValidator,
});

export { makePackageEntity };
