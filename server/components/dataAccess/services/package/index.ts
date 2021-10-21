import cloneDeep from 'clone-deep';
import deepEqual from 'deep-equal';
import mongoose from 'mongoose';
import { Package } from '../../../../models/Package';
import { makeCacheDbService } from '../cache';
import { makeTeacherDbService } from '../teacher';
import { PackageDbService } from './packageDbService';

const makePackageDbService = new PackageDbService().init({
  mongoose,
  dbModel: Package,
  cloneDeep,
  makeParentDbService: makeTeacherDbService,
  deepEqual,
  makeCacheDbService,
});

export { makePackageDbService };
