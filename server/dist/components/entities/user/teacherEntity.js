"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeacherEntity = void 0;
const AbstractEntity_1 = require("../abstractions/AbstractEntity");
class TeacherEntity extends AbstractEntity_1.AbstractEntity {
    build(entityData) {
        const { userId } = entityData;
        return Object.freeze({
            userId,
            teachingLanguages: [],
            alsoSpeaks: [],
            introductionVideo: '',
            isApproved: false,
            isHidden: 'false',
            teacherType: 'unlicensed',
            licensePath: '',
            hourlyRate: { amount: '35', currency: 'SGD' },
            lessonCount: 0,
            studentCount: 0,
        });
    }
}
exports.TeacherEntity = TeacherEntity;
