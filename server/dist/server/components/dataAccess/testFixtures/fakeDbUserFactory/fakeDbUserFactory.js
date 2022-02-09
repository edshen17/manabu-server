"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FakeDbUserFactory = void 0;
const AbstractFakeDbDataFactory_1 = require("../abstractions/AbstractFakeDbDataFactory");
class FakeDbUserFactory extends AbstractFakeDbDataFactory_1.AbstractFakeDbDataFactory {
    _faker;
    _fakeDbTeacherFactory;
    _graphDbService;
    createFakeDbTeacher = async () => {
        const fakeBuildParams = await this._createFakeBuildParams();
        fakeBuildParams.teacherData = await this._fakeDbTeacherFactory.createFakeData();
        const fakeDbTeacher = await this.createFakeDbData(fakeBuildParams);
        const dbServiceAccessOptions = this._dbService.getBaseDbServiceAccessOptions();
        await this._graphDbService.createUserNode({ user: fakeDbTeacher, dbServiceAccessOptions });
        return fakeDbTeacher;
    };
    createFakeDbUser = async () => {
        const fakeDbUser = await this.createFakeDbData();
        const dbServiceAccessOptions = this._dbService.getBaseDbServiceAccessOptions();
        await this._graphDbService.createUserNode({ user: fakeDbUser, dbServiceAccessOptions });
        return fakeDbUser;
    };
    _createFakeBuildParams = async () => {
        const fakeBuildParams = {
            name: this._faker.name.findName(),
            email: this._faker.internet.email(),
            password: this._faker.internet.password(),
            profileImageUrl: this._faker.image.imageUrl(),
            contactMethods: [
                {
                    name: 'line',
                    type: 'online',
                    address: this._faker.internet.userName(),
                    isPrimaryMethod: true,
                },
            ],
        };
        return fakeBuildParams;
    };
    _initTemplate = async (optionalInitParams) => {
        const { faker, makeFakeDbTeacherFactory, makeGraphDbService } = optionalInitParams;
        this._faker = faker;
        this._fakeDbTeacherFactory = await makeFakeDbTeacherFactory;
        this._graphDbService = await makeGraphDbService;
    };
}
exports.FakeDbUserFactory = FakeDbUserFactory;
