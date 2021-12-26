import { expect } from 'chai';
import { makeTeacherEntity } from '.';
import { TeacherEntity, TeacherEntityBuildResponse } from './teacherEntity';

let teacherEntity: TeacherEntity;

before(async () => {
  teacherEntity = await makeTeacherEntity;
});

describe('teacher entity', () => {
  describe('build', () => {
    context('given valid inputs', () => {
      it('should create a teacher with the given user id', () => {
        const fakeTeacher = <TeacherEntityBuildResponse>teacherEntity.build({});
        expect(fakeTeacher.type).to.equal('unlicensed');
      });
    });
  });
});
