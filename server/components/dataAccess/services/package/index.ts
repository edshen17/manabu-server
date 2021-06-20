import { makeDb } from '../..';
import { Package } from '../../../../models/Package';
import { PackageDbService } from './packageDbService';
import cloneDeep from 'clone-deep';

const makePackageDbService = new PackageDbService().init({ makeDb, dbModel: Package, cloneDeep });

export { makePackageDbService };
