const AccessControl = require('accesscontrol');
const ac = new AccessControl();
 
exports.roles = (function() {
ac.grant('user')
    .readAny('userProfile', ['*', '!password'])
    .updateOwn('userProfile')
    .createOwn('availableTime')
    .deleteOwn('availableTime')
    .readAny('availableTime')
    .updateOwn('availableTime')
    .readAny('teacherProfile', ['*', '!licensePath']) // pending teacher
    .createOwn('appointment')
    .updateOwn('appointment')
    .readAny('appointment')
    .createOwn('package')
    .updateOwn('package')
    .readAny('package')
    .createOwn('packageTransaction')
    .readOwn('packageTransaction')
    .updateOwn('packageTransaction')
    .readOwn('minuteBank')
 
ac.grant('teacher')
    .extend('user')
    .updateOwn('teacherProfile')
    .readOwn('teacherProfile', ['*'])

ac.grant('admin')
 .extend('user')
 .extend('teacher')
 .readAny('teacherProfile', ['*'])
 .updateAny('userProfile')
 .updateAny('availableTime')
 .updateAny('teacherProfile')
 .updateAny('package')
 .updateAny('packageTransaction')
 .updateAny('minuteBank')
    return ac;
})();