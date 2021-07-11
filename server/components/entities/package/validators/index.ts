import { PackageEntityValidator } from './packageEntityValidator';
import { extendedJoi as joi } from '../../utils/joi/extendedJoi';

const makePackageEntityValidator = new PackageEntityValidator().init({ joi });

export { makePackageEntityValidator };
