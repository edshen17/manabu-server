const AccessControl = require('accesscontrol');
const ac = new AccessControl();
 
exports.roles = (function() {
ac.grant('user')
    .readAny('userProfile', ['*', '!password', '!settings'])
    .readOwn('userProfile', ['*', '!password'])
    .updateOwn('userProfile')
    .createOwn('availableTime')
    .deleteOwn('availableTime')
    .readAny('availableTime')
    .updateOwn('availableTime')
    .readAny('teacherProfile', ['*', '!licensePath', '!_id']) // pending teacher
    .updateOwn('teacherProfile')
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
    .readOwn('teacherProfile', ['*', '!_id'])

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