import { makeDb } from '../..';
import { Package } from '../../../../models/Package';
import { PackageDbService } from './packageDbService';

const makePackageDbService = new PackageDbService({ packageDb: Package }).init({ makeDb });

export { makePackageDbService };
