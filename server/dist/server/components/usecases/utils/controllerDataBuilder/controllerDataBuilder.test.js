"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const _1 = require(".");
const fakeDbUserFactory_1 = require("../../../dataAccess/testFixtures/fakeDbUserFactory");
let controllerDataBuilder;
let fakeDbUserFactory;
before(async () => {
    controllerDataBuilder = _1.makeControllerDataBuilder;
    fakeDbUserFactory = await fakeDbUserFactory_1.makeFakeDbUserFactory;
});
describe('controllerDataBuilder', () => {
    describe('build', () => {
        it('should build a valid ControllerData object with a random current API user', async () => {
            const fakeUser = await fakeDbUserFactory.createFakeDbUser();
            const testCurrentAPIUser = {
                userId: fakeUser._id,
                role: fakeUser.role,
            };
            const controllerData = controllerDataBuilder.currentAPIUser(testCurrentAPIUser).build();
            (0, chai_1.expect)(controllerData.currentAPIUser).to.deep.equal(testCurrentAPIUser);
            (0, chai_1.expect)(controllerData.routeData).to.deep.equal({
                params: {},
                body: {},
                headers: {},
                query: {},
                endpointPath: '',
                rawBody: {},
            });
        });
        it('should build a valid ControllerData object with an empty current API user and a non-empty routeData object', async () => {
            const testRouteData = {
                params: {
                    uId: 'some uid',
                },
                body: {
                    isTeacherApp: false,
                },
                query: {
                    query: 'some query',
                },
                endpointPath: '',
                headers: {},
                rawBody: {},
            };
            const controllerData = await controllerDataBuilder.routeData(testRouteData).build();
            (0, chai_1.expect)(controllerData.currentAPIUser).to.deep.equal({
                userId: undefined,
                role: 'user',
            });
            (0, chai_1.expect)(controllerData.routeData).to.deep.equal(testRouteData);
        });
    });
});
