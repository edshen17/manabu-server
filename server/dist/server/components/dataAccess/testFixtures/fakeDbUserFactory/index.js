"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeFakeDbUserFactory = void 0;
const clone_deep_1 = __importDefault(require("clone-deep"));
const faker_1 = __importDefault(require("faker"));
const user_1 = require("../../../entities/user");
const graph_1 = require("../../services/graph");
const user_2 = require("../../services/user");
const fakeDbTeacherFactory_1 = require("../fakeDbTeacherFactory");
const fakeDbUserFactory_1 = require("./fakeDbUserFactory");
const makeFakeDbUserFactory = new fakeDbUserFactory_1.FakeDbUserFactory().init({
    faker: faker_1.default,
    cloneDeep: clone_deep_1.default,
    makeEntity: user_1.makeUserEntity,
    makeDbService: user_2.makeUserDbService,
    makeFakeDbTeacherFactory: fakeDbTeacherFactory_1.makeFakeDbTeacherFactory,
    makeGraphDbService: graph_1.makeGraphDbService,
});
exports.makeFakeDbUserFactory = makeFakeDbUserFactory;
