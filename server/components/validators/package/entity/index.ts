import { joi } from '../../../entities/utils/joi';
import { PackageEntityValidator } from './packageEntityValidator';

const makePackageEntityValidator = new PackageEntityValidator().init({ joi });

export { makePackageEntityValidator };
