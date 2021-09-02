import { makePackageEntityValidator } from '../../validators/package/entity';
import { PackageEntity } from './packageEntity';

const makePackageEntity = new PackageEntity().init({
  makeEntityValidator: makePackageEntityValidator,
});

export { makePackageEntity };
