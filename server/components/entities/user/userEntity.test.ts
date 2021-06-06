import chai from 'chai';
import { makeUserEntity } from './index';

const expect = chai.expect;

describe('user entity', () => {
  it('should get the correct data provided good input', () => {
    const testEntity = makeUserEntity.build({
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
