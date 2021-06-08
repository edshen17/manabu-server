"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserEntity = void 0;
const AbstractEntity_1 = require("../abstractions/AbstractEntity");
class UserEntity extends AbstractEntity_1.AbstractEntity {
    constructor(props) {
        super();
        this._validateUserInput = (userData) => {
            const { name, email, password, profileImage } = userData;
            if (!this.inputValidator.isValidName(name)) {
                throw new Error('User must have a valid name.');
            }
            if (!this.inputValidator.isValidEmail(email)) {
                throw new Error('User must have a valid email.');
            }
            if (!this.inputValidator.isValidPassword(password)) {
                throw new Error('User must have a valid password.');
            }
        };
        this._setPassword = (password) => {
            if (password) {
                return this.passwordHasher(password);
            }
            else {
                return undefined;
            }
        };
        const { sanitize, inputValidator, passwordHasher, randTokenGenerator } = props;
        this.sanitize = sanitize;
        this.inputValidator = inputValidator;
        this.passwordHasher = passwordHasher;
        this.randTokenGenerator = randTokenGenerator;
    }
    build(entityData) {
        let verificationToken;
        let { name, email, password, profileImage } = entityData;
        try {
            this._validateUserInput(entityData);
            return Object.freeze({
                name,
                email,
                password: this._setPassword(password),
                profileImage: profileImage || '',
                profileBio: '',
                dateRegistered: new Date(),
                lastUpdated: new Date(),
                languages: [],
                region: '',
                timezone: '',
                lastOnline: new Date(),
                role: 'user',
                settings: { currency: 'SGD' },
                membership: [],
                commMethods: [],
                emailVerified: false,
                verificationToken: (verificationToken = this.randTokenGenerator(name, email)),
            });
        }
        catch (err) {
            throw err;
        }
    }
}
exports.UserEntity = UserEntity;
