import { expect } from 'chai';
import { JoinedUserDoc } from '../../../models/User';
import { makeFakeDbUserFactory } from '../../dataAccess/testFixtures/fakeDbUserFactory';
import { FakeDbUserFactory } from '../../dataAccess/testFixtures/fakeDbUserFactory/fakeDbUserFactory';
import { makePackageEntity } from './index';
import { PackageEntity } from './packageEntity';

let fakeDbUserFactory: FakeDbUserFactory;
let packageEntity: PackageEntity;
let fakeUser: JoinedUserDoc;

before(async () => {
  fakeDbUserFactory = await makeFakeDbUserFactory;
  packageEntity = await makePackageEntity;
  fakeUser = await fakeDbUserFactory.createFakeDbTeacher();
});

context('package entity', () => {
  describe('build', async () => {
    context('given valid inputs', () => {
      it('should return a package entity object', async () => {
        const fakePackage = await packageEntity.build({
          lessonAmount: 5,
          isOffering: true,
          lessonDurations: [],
          packageName: 'light',
          packageType: 'default',
        });
        expect(fakePackage.lessonAmount).to.equal(5);
        expect(fakePackage.isOffering).to.equal(true);
        expect(fakePackage.lessonDurations.length).to.equal(0);
        expect(fakePackage.packageType).to.equal('default');
      });
    });
    context('given invalid inputs', () => {
      it('should throw an error', async () => {
        try {
          const entityData: any = {};
          const fakePackage = await packageEntity.build(entityData);
        } catch (err) {
          expect(err).to.be.an('error');
        }
      });
    });
  });
});
