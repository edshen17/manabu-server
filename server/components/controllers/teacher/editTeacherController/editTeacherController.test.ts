import { expect } from 'chai';
import { makeEditTeacherController } from '.';
import { JoinedUserDoc } from '../../../../models/User';
import { makeFakeDbUserFactory } from '../../../dataAccess/testFixtures/fakeDbUserFactory';
import { FakeDbUserFactory } from '../../../dataAccess/testFixtures/fakeDbUserFactory/fakeDbUserFactory';
import { makeIHttpRequestBuilder } from '../../utils/iHttpRequestBuilder';
import { IHttpRequestBuilder } from '../../utils/iHttpRequestBuilder/iHttpRequestBuilder';
import { EditTeacherController } from './editTeacherController';

let fakeDbUserFactory: FakeDbUserFactory;
let editTeacherController: EditTeacherController;
let iHttpRequestBuilder: IHttpRequestBuilder;
let fakeUser: JoinedUserDoc;
let fakeTeacher: JoinedUserDoc;

before(async () => {
  fakeDbUserFactory = await makeFakeDbUserFactory;
  editTeacherController = await makeEditTeacherController;
  iHttpRequestBuilder = makeIHttpRequestBuilder;
});

beforeEach(async () => {
  fakeUser = await fakeDbUserFactory.createFakeDbUser();
  fakeTeacher = await fakeDbUserFactory.createFakeDbTeacherWithDefaultPackages();
});

describe('editTeacherController', () => {
  describe('makeRequest', () => {
    it('should edit the given teacher and return a restricted view', async () => {
      const editTeacherHttpRequest = iHttpRequestBuilder
        .currentAPIUser({
          userId: fakeTeacher._id,
          role: fakeTeacher.role,
          teacherId: fakeTeacher.teacherData!._id,
        })
        .params({ teacherId: fakeTeacher.teacherData!._id })
        .body({
          licensePathUrl: 'https://fakeimg.pl/300/',
        })
        .build();
      const editTeacherRes = await editTeacherController.makeRequest(editTeacherHttpRequest);
      expect(editTeacherRes.statusCode).to.equal(200);
      if ('user' in editTeacherRes.body) {
        expect(editTeacherRes.body.user.teacherData!.licensePathUrl).to.equal(
          'https://fakeimg.pl/300/'
        );
      }
    });
    it('should not edit the user and deny access (editing other)', async () => {
      const editTeacherHttpRequest = iHttpRequestBuilder
        .currentAPIUser({
          userId: fakeTeacher._id,
          role: fakeTeacher.role,
        })
        .params({ uId: fakeUser._id })
        .body({
          name: 'new name',
        })
        .build();
      const editTeacherRes = await editTeacherController.makeRequest(editTeacherHttpRequest);
      expect(editTeacherRes.statusCode).to.equal(401);
    });
    it('should not edit the teacher and deny access (editing self but with restricted properties)', async () => {
      const editTeacherHttpRequest = iHttpRequestBuilder
        .currentAPIUser({
          userId: fakeTeacher._id,
          role: fakeTeacher.role,
        })
        .params({ uId: fakeUser._id })
        .body({
          _id: 'new id',
          userId: 'new id',
          lessonCount: 5,
          studentCount: 5,
        })
        .build();
      const editTeacherRes = await editTeacherController.makeRequest(editTeacherHttpRequest);
      expect(editTeacherRes.statusCode).to.equal(401);
    });
    it('should throw an error if user to edit is not found', async () => {
      const editTeacherHttpRequest = iHttpRequestBuilder
        .currentAPIUser({
          userId: fakeTeacher._id,
          role: fakeTeacher.role,
        })
        .params({ uId: undefined })
        .body({
          licensePathUrl: 'new license path',
        })
        .build();
      const editTeacherRes = await editTeacherController.makeRequest(editTeacherHttpRequest);
      expect(editTeacherRes.statusCode).to.equal(401);
    });
  });
});
