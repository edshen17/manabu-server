import chai from 'chai';
import { makeUserEntity } from './index';

const expect = chai.expect;
let defaultTestUserEntityParams: any;
before(() => {
  defaultTestUserEntityParams = {
    name: 'test',
    password: 'pass',
  };
});

describe('user entity', () => {
  describe('build', () => {
    it('should get the correct data provided good input', () => {
      defaultTestUserEntityParams.email = 'test@gmail.com';
      const testEntity = makeUserEntity.build(defaultTestUserEntityParams);
      if ('password' in testEntity) {
        expect(testEntity.name).to.equal('test');
        expect(testEntity.password).to.not.equal('pass');
        expect(testEntity.email).to.equal('test@gmail.com');
        expect(testEntity.profileImage).to.equal('');
        expect(testEntity.verificationToken).to.not.equal('');
      }
    });
    it('should have an undefined password property if no password was given', () => {
      const testEntity = makeUserEntity.build({
        name: 'test',
        email: 'test@gmail.com',
      });
      if ('password' in testEntity) {
        expect(testEntity.password).to.equal(undefined);
      }
    });
  });
});
