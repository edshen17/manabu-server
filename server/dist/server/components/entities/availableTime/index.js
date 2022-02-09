"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeAvailableTimeEntity = void 0;
const entity_1 = require("../../validators/availableTime/entity");
const availableTimeEntity_1 = require("./availableTimeEntity");
const makeAvailableTimeEntity = new availableTimeEntity_1.AvailableTimeEntity().init({
    makeEntityValidator: entity_1.makeAvailableTimeEntityValidator,
});
exports.makeAvailableTimeEntity = makeAvailableTimeEntity;
