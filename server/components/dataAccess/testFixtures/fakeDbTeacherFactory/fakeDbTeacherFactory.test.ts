import { expect } from 'chai';
import { makeFakeDbTeacherFactory } from '.';
import { FakeDbTeacherFactory } from './fakeDbTeacherFactory';

let fakeDbTeacherFactory: FakeDbTeacherFactory;

before(async () => {
  fakeDbTeacherFactory = await makeFakeDbTeacherFactory;
});

describe('fakeDbTeacherFactory', () => {
  describe('createFakeDbData', () => {
    it('should create an fake teacher to embed', async () => {
      const newTeacher = await fakeDbTeacherFactory.createFakeDbData();
      expect(newTeacher.packages.length).to.equal(4);
    });
  });
});
