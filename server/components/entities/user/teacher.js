/**
 * Factory to build a teacher
 * @returns Object returns function makeUTeacher
 */
function buildMakeTeacher({}) {
  return function makeTeacher({ userId } = {}) {
    return Object.freeze({
      getUserId: () => userId,
    });
  };
}

module.exports = { buildMakeTeacher };
