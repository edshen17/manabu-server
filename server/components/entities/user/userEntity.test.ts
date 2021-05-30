import chai from 'chai';
import { userEntity } from './index';

const expect = chai.expect;

describe('user entity', () => {
  it('should not throw an error if no user data is provided', () => {
    const emptyName = userEntity.build({}).getName();
    expect(emptyName).to.equal(undefined);
  });
  it('should get the correct data provided good input', () => {
    const testEntity = userEntity.build({
      name: 'test',
      password: 'pass',
      email: 'test@gmail.com',
    });
    expect(testEntity.getName()).to.equal('test');
    expect(testEntity.getPassword()).to.not.equal('pass');
    expect(testEntity.getEmail()).to.equal('test@gmail.com');
    expect(testEntity.getProfileImage()).to.equal('');
    expect(testEntity.getVerificationToken()).to.not.equal('');
  });
});
