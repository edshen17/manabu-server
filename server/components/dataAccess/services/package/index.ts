import { makeDb } from '../..';
import { Package } from '../../../../models/Package';
import { PackageDbService } from './packageDbService';

const makePackageDbService = new PackageDbService().init({ makeDb, dbModel: Package });

export { makePackageDbService };
