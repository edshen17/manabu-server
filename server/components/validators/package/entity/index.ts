import { PackageEntityValidator } from './packageEntityValidator';
import { joi } from '../../../entities/utils/joi';

const makePackageEntityValidator = new PackageEntityValidator().init({ joi });

export { makePackageEntityValidator };
