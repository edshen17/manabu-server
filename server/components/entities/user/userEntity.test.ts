import chai from 'chai';
import { userEntity } from './index';

const expect = chai.expect;

describe('user entity', () => {
  it('should throw an error if no user data is provided', () => {
    try {
      const emptyName = userEntity.build({}).getName();
    } catch (err) {
      expect(err).to.be.an('error');
    }
  });
  it('should get the correct data provided good input', () => {
    const testEntity = userEntity.build({
      name: 'test',
      password: 'pass',
      email: 'test@gmail.com',
    });
    expect(testEntity.name).to.equal('test');
    expect(testEntity.password).to.not.equal('pass');
    expect(testEntity.email).to.equal('test@gmail.com');
    expect(testEntity.profileImage).to.equal('');
    expect(testEntity.verificationToken).to.not.equal('');
  });
});
