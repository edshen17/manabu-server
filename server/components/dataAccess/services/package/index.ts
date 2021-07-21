import { makeDb } from '../..';
import { PackageDbService } from './packageDbService';
import cloneDeep from 'clone-deep';
import { makeTeacherDbService } from '../teacher';
import deepEqual from 'deep-equal';
import { makePackageTransactionDbService } from '../packageTransaction';

const makePackageDbService = new PackageDbService().init({
  makeDb,
  dbModel: null,
  cloneDeep,
  makeParentDbService: makeTeacherDbService,
  deepEqual,
  makePackageTransactionDbService,
});

export { makePackageDbService };
