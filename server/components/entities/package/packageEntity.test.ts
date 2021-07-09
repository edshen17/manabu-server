import { expect } from 'chai';
import { JoinedUserDoc } from '../../dataAccess/services/user/userDbService';
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
  fakeUser = await fakeDbUserFactory.createFakeDbTeacherWithDefaultPackages();
});

context('package entity', () => {
  describe('build', async () => {
    context('given valid inputs', () => {
      it('should return a package entity object', async () => {
        const fakePackage = await packageEntity.build({
          hostedBy: fakeUser._id.toString(),
          lessonAmount: 5,
          isOffering: true,
          packageDurations: [],
          packageType: 'light',
        });
        expect(fakePackage.hostedBy.toString()).to.equal(fakeUser._id.toString());
        expect(fakePackage.lessonAmount).to.equal(5);
        expect(fakePackage.isOffering).to.equal(true);
        expect(fakePackage.packageDurations.length).to.equal(0);
        expect(fakePackage.packageType).to.equal('light');
        expect(fakePackage.priceDetails).to.deep.equal({ currency: 'SGD', hourlyPrice: 35 });
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
