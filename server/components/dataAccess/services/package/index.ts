import { makeDb } from '../..';
import { PackageDbService } from './packageDbService';
import cloneDeep from 'clone-deep';
import { makeTeacherDbService } from '../teacher';
import deepEqual from 'deep-equal';

const makePackageDbService = new PackageDbService().init({
  makeDb,
  dbModel: null,
  cloneDeep,
  makeParentDbService: makeTeacherDbService,
  deepEqual,
});

export { makePackageDbService };
