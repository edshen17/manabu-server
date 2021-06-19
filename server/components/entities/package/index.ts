import { makeUserDbService } from '../../dataAccess/services/user';
import { PackageEntity } from './packageEntity';

const makePackageEntity = new PackageEntity().init({
  makeUserDbService,
});

export { makePackageEntity };
