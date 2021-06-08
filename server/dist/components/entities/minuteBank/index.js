"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeMinuteBankEntity = void 0;
const dataAccess_1 = require("../../dataAccess");
const minuteBankEntity_1 = require("./minuteBankEntity");
const makeMinuteBankEntity = new minuteBankEntity_1.MinuteBankEntity().init({
    makeUserDbService: dataAccess_1.makeUserDbService,
});
exports.makeMinuteBankEntity = makeMinuteBankEntity;
