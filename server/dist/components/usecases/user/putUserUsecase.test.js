"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = __importDefault(require("chai"));
const initializeUser_1 = require("../testFixtures/initializeUser");
const initializeUsecaseSettings_1 = require("../testFixtures/initializeUsecaseSettings");
const expect = chai_1.default.expect;
let controllerData;
let initUserParams;
beforeEach(async () => {
    initUserParams = await initializeUsecaseSettings_1.initializeUsecaseSettings();
    controllerData = initUserParams.controllerData;
});
context('makeRequest', async () => {
    const makeUpdate = async (updatingDbUser, updaterDbUser, updateParams) => {
        controllerData.currentAPIUser.userId = updaterDbUser._id;
        controllerData.routeData.body = updateParams;
        controllerData.routeData.params = { uId: updatingDbUser._id };
        return await initUserParams.putUserUsecase.makeRequest(initUserParams.controllerData);
    };
    describe('editing user data', () => {
        it('should update the user in the db and return the correct properties (self)', async () => {
            const newUser = await initializeUser_1.initializeUser(initUserParams);
            expect(newUser.profileBio).to.equal('');
            const updatedUser = await makeUpdate(newUser, newUser, { profileBio: 'new profile bio' });
            expect(updatedUser.profileBio).to.equal('new profile bio');
            expect(updatedUser).to.not.have.property('password');
            expect(updatedUser).to.have.property('settings');
        });
        it('should deny access when updating restricted properties (self)', async () => {
            try {
                const newUser = await initializeUser_1.initializeUser(initUserParams);
                const updatedUser = await makeUpdate(newUser, newUser, {
                    verificationToken: 'new token',
                    role: 'admin',
                });
            }
            catch (err) {
                expect(err.message).to.equal('You do not have the permissions to update those properties.');
            }
        });
        it('should deny access when trying to update restricted properties (not self)', async () => {
            try {
                const updater = await initializeUser_1.initializeUser(initUserParams);
                const test = await initializeUsecaseSettings_1.initializeUsecaseSettings(); // reset
                controllerData.routeData.body.isTeacherApp = true;
                const updatee = await initializeUser_1.initializeUser(test);
                expect(updatee.profileBio).to.equal('');
                const updatedUser = await makeUpdate(updatee, updater, {
                    profileBio: 'new profile bio',
                });
                expect(updatee.profileBio).to.equal('');
            }
            catch (err) {
                expect(err.message).to.equal('Access denied.');
            }
        });
    });
});
