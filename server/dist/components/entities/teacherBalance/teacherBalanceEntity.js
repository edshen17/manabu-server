"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeacherBalanceEntity = void 0;
const AbstractEntity_1 = require("../abstractions/AbstractEntity");
class TeacherBalanceEntity extends AbstractEntity_1.AbstractEntity {
    build(entityData) {
        const { userId } = entityData;
        return Object.freeze({
            userId,
            balanceDetails: {
                balance: 0,
                currency: 'SGD',
            },
        });
    }
}
exports.TeacherBalanceEntity = TeacherBalanceEntity;
