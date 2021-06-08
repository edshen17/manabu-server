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
    describe('creating a new user should return the correct properties', () => {
        it('should create a new user in the db', async () => {
            const newUser = await initializeUser_1.initializeUser(initUserParams);
            expect(newUser.profileBio).to.equal('');
        });
        it('should create a new teacher and return a joined user/teacher/packages doc (viewing as self)', async () => {
            controllerData.routeData.body.isTeacherApp = true;
            const newTeacher = await initializeUser_1.initializeUser(initUserParams);
            expect(newTeacher).to.have.property('settings');
            expect(newTeacher).to.not.have.property('password');
            expect(newTeacher.teacherData).to.not.have.property('licensePath');
        });
        it('should create a new teacher and return a joined user/teacher/packages doc (viewing as self)', async () => {
            initUserParams.viewingAs = 'admin';
            controllerData.routeData.body.isTeacherApp = true;
            const newTeacher = await initializeUser_1.initializeUser(initUserParams);
            expect(newTeacher).to.have.property('settings');
            expect(newTeacher).to.not.have.property('password');
            expect(newTeacher.teacherData).to.have.property('licensePath');
            expect(newTeacher.teacherData.packages.length).to.equal(3);
        });
    });
});
