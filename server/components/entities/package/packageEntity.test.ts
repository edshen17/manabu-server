import chai from 'chai';
import { JoinedUserDoc } from '../../dataAccess/services/user/userDbService';
import { makeFakeDbUserGenerator } from '../../dataAccess/testFixtures/fakeDbUserGenerator';
import { FakeDBUserGenerator } from '../../dataAccess/testFixtures/fakeDbUserGenerator/fakeDbUserGenerator';
import { makePackageEntity } from './index';
import { PackageEntity } from './packageEntity';

const expect = chai.expect;
const assert = chai.assert;
let fakeDbUserGenerator: FakeDBUserGenerator;
let packageEntity: PackageEntity;
let fakeUser: JoinedUserDoc;

before(async () => {
  fakeDbUserGenerator = await makeFakeDbUserGenerator;
  packageEntity = await makePackageEntity;
  fakeUser = await fakeDbUserGenerator.createFakeDbTeacherWithDefaultPackages();
});

context('package entity', () => {
  describe('build', async () => {
    describe('given valid inputs', () => {
      it('should return a package entity object', async () => {
        const testPackage = await packageEntity.build({
          hostedBy: fakeUser._id,
          priceDetails: { currency: 'SGD', hourlyPrice: 5 },
          lessonAmount: 5,
          isOffering: true,
          packageDurations: [],
          packageType: 'light',
        });
        expect(testPackage.hostedBy).to.equal(fakeUser._id);
        expect(testPackage.lessonAmount).to.equal(5);
        expect(testPackage.isOffering).to.equal(true);
        expect(testPackage.packageDurations.length).to.equal(0);
        expect(testPackage.packageType).to.equal('light');
        assert.deepEqual(testPackage.priceDetails, { currency: 'SGD', hourlyPrice: 5 });
      });
      it('should return default values if optional parameters are not given', async () => {
        const testPackage = await packageEntity.build({
          hostedBy: fakeUser._id,
          lessonAmount: 5,
          packageType: 'moderate',
        });
        assert.deepEqual(testPackage.packageDurations, [30, 60]);
        expect(testPackage.isOffering).to.equal(true);
      });
    });
  });
});
