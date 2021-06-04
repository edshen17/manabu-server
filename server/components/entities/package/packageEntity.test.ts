import chai from 'chai';
import { packageEntity } from './index';

const expect = chai.expect;
const assert = chai.assert;
let testPackageEntityProperties: any;

beforeEach(() => {
  testPackageEntityProperties = {
    hostedBy: 'some hostedBy',
    priceDetails: {},
    lessonAmount: 5,
    isOffering: true,
    packageDurations: [],
    packageType: 'light',
  };
});
context('package entity', () => {
  describe('build', () => {
    describe('given valid inputs', () => {
      it('should return given inputs', () => {
        const testPackage = packageEntity.build(testPackageEntityProperties);
        expect(testPackage.hostedBy).to.equal('some hostedBy');
        expect(testPackage.lessonAmount).to.equal(5);
        expect(testPackage.isOffering).to.equal(true);
        expect(testPackage.packageDurations.length).to.equal(0);
        expect(testPackage.packageType).to.equal('light');
        assert.deepEqual(testPackage.priceDetails, {});
      });
      it('should return given inputs and default values if not given', () => {
        testPackageEntityProperties.isOffering = undefined;
        testPackageEntityProperties.packageDurations = undefined;
        const testPackage = packageEntity.build(testPackageEntityProperties);
        expect(testPackage.packageDurations.length).to.equal(2);
        expect(testPackage.isOffering).to.equal(true);
      });
    });

    describe('given invalid inputs', () => {
      it('should returned undefined if provided no input', () => {
        const testPackage = packageEntity.build({});
        expect(typeof testPackage.hostedBy).to.equal('undefined');
      });
    });
  });
});
