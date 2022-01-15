import { convertStringToObjectId } from '../../../components/entities/utils/convertStringToObjectId';
import { makeJwtHandler } from '../../../components/usecases/utils/jwtHandler';
import { JwtHandler } from '../../../components/usecases/utils/jwtHandler/jwtHandler';
import { JoinedUserDoc } from '../../../models/User';

let jwtHandler: JwtHandler;

(async () => {
  jwtHandler = await makeJwtHandler;
})();

const verifyToken = async (req: any, res: any, next: any) => {
  try {
    if (req.headers['x-requested-with'] && req.cookies.hp && req.cookies.sig) {
      const token = req.cookies.hp + req.cookies.sig;
      const decodedUser: JoinedUserDoc = await jwtHandler.verify(token);
      if (!decodedUser) {
        throw new Error('Invalid jwt format.');
      }
      const { _id, role, teacherData } = decodedUser;
      req.userId = convertStringToObjectId(_id);
      req.role = role || 'user';
      if (teacherData) {
        req.teacherId = convertStringToObjectId(teacherData._id);
      }
    }
    next();
  } catch (err) {
    next();
  }
};

export { verifyToken };
