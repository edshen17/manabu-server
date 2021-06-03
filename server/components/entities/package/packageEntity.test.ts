import chai from 'chai';
import { packageEntity } from './index';

const expect = chai.expect;
const assert = chai.assert;
context('package entity', () => {
  describe('build', () => {
    describe('given valid inputs', () => {
      it('should return given inputs', () => {
        const testPackage = packageEntity.build({
          hostedBy: 'some hostedBy',
          priceDetails: {},
          lessonAmount: 5,
          isOffering: true,
          packageDurations: [],
          packageType: 'light',
        });
        expect(testPackage.getHostedBy()).to.equal('some hostedBy');
        expect(testPackage.getLessonAmount()).to.equal(5);
        expect(testPackage.getIsOffering()).to.equal(true);
        expect(testPackage.getPackageDurations().length).to.equal(0);
        expect(testPackage.getPackageType()).to.equal('light');
        assert.deepEqual(testPackage.getPriceDetails(), {});
      });
    });

    describe('given invalid inputs', () => {
      it('should returned undefined if provided no input', () => {
        const testPackage = packageEntity.build({});
        expect(typeof testPackage.getHostedBy()).to.equal('undefined');
      });
    });
  });
});
