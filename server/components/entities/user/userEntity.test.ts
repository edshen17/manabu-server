import { expect } from 'chai';
import { makeUserEntity } from './index';
import { UserEntity } from './userEntity';

let defaultTestUserEntityParams: any;
let userEntity: UserEntity;

before(async () => {
  defaultTestUserEntityParams = {
    name: 'test',
    password: 'pass',
  };
  userEntity = await makeUserEntity;
});

describe('user entity', () => {
  describe('build', () => {
    context('valid inputs', () => {
      it('should get the correct data provided good input', () => {
        defaultTestUserEntityParams.email = 'test@gmail.com';
        const testEntity = userEntity.build(defaultTestUserEntityParams);
        expect(testEntity.name).to.equal('test');
        expect(testEntity.password).to.not.equal('pass');
        expect(testEntity.email).to.equal('test@gmail.com');
        expect(testEntity.profileImageUrl).to.equal('');
        expect(testEntity.verificationToken).to.not.equal('');
      });
      it('should have an undefined password property if no password was given', () => {
        const testEntity = userEntity.build({
          name: 'test',
          email: 'test@gmail.com',
        });
        expect(testEntity.password).to.equal(undefined);
      });
    });
    context('invalid inputs', () => {});
  });
});
