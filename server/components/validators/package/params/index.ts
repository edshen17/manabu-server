import { joi } from '../../../entities/utils/joi';
import { PackageParamsValidator } from './packageParamsValidator';

const makePackageParamsValidator = new PackageParamsValidator().init({ joi });

export { makePackageParamsValidator };
