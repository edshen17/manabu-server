import { makeDb } from '../..';
import { PackageDbService } from './packageDbService';
import cloneDeep from 'clone-deep';
import { makeTeacherDbService } from '../teacher';
import deepEqual from 'deep-equal';
import { makeCacheDbService } from '../cache';
import { Package } from '../../../../models/Package';

const makePackageDbService = new PackageDbService().init({
  makeDb,
  dbModel: Package,
  cloneDeep,
  makeParentDbService: makeTeacherDbService,
  deepEqual,
  makeCacheDbService,
});

export { makePackageDbService };
