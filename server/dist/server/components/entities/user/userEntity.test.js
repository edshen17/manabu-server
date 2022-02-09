"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const index_1 = require("./index");
let defaultTestUserEntityParams;
let userEntity;
before(async () => {
    defaultTestUserEntityParams = {
        name: 'test',
        password: 'St0nGP@ssword!',
    };
    userEntity = await index_1.makeUserEntity;
});
describe('user entity', () => {
    describe('build', () => {
        context('valid inputs', () => {
            it('should get the correct data provided good input', () => {
                defaultTestUserEntityParams.email = 'test@gmail.com';
                const testEntity = userEntity.build(defaultTestUserEntityParams);
                if ('name' in testEntity) {
                    (0, chai_1.expect)(testEntity.name).to.equal('test');
                    (0, chai_1.expect)(testEntity.password).to.not.equal('pass');
                    (0, chai_1.expect)(testEntity.email).to.equal('test@gmail.com');
                    (0, chai_1.expect)(testEntity.profileImageUrl).to.equal('https://avatars.dicebear.com/api/initials/test.svg');
                    (0, chai_1.expect)(testEntity.verificationToken).to.not.equal('');
                    (0, chai_1.expect)(testEntity.nameNGrams).to.not.equal('');
                }
            });
            it('should have an undefined password property if no password was given', () => {
                const testEntity = userEntity.build({
                    name: 'test',
                    email: 'test@gmail.com',
                });
                if ('name' in testEntity) {
                    (0, chai_1.expect)(testEntity.password).to.equal(undefined);
                }
            });
        });
        context('invalid inputs', () => {
            it('should throw an error', () => {
                defaultTestUserEntityParams.password = 'weak password';
                try {
                    userEntity.build(defaultTestUserEntityParams);
                }
                catch (err) {
                    (0, chai_1.expect)(err).to.be.an('error');
                }
            });
        });
    });
});
