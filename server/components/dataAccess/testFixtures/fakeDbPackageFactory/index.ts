import cloneDeep from 'clone-deep';
import { makePackageEntity } from '../../../entities/package';
import { makePackageDbService } from '../../services/package';
import { makeFakeDbUserFactory } from '../fakeDbUserFactory';
import { FakeDbPackageFactory } from './fakeDbPackageFactory';

const makeFakeDbPackageFactory = new FakeDbPackageFactory().init({
  makeEntity: makePackageEntity,
  cloneDeep,
  makeDbService: makePackageDbService,
  makeFakeDbUserFactory,
});

export { makeFakeDbPackageFactory };
