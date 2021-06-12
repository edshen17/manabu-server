import { makeUserDbService } from '../../dataAccess';
import { PackageEntity } from './packageEntity';

const makePackageEntity = new PackageEntity().init({
  makeUserDbService,
});

export { makePackageEntity };
