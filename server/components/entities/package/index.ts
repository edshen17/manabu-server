import { makeUserDbService } from '../../dataAccess/services/usersDb';
import { PackageEntity } from './packageEntity';

const makePackageEntity = new PackageEntity().init({
  makeUserDbService,
});

export { makePackageEntity };
