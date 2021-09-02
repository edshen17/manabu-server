import cloneDeep from 'clone-deep';
import deepEqual from 'deep-equal';
import { makeDb } from '../..';
import { Package } from '../../../../models/Package';
import { makeCacheDbService } from '../cache';
import { makeTeacherDbService } from '../teacher';
import { PackageDbService } from './packageDbService';

const makePackageDbService = new PackageDbService().init({
  makeDb,
  dbModel: Package,
  cloneDeep,
  makeParentDbService: makeTeacherDbService,
  deepEqual,
  makeCacheDbService,
});

export { makePackageDbService };
