import { convertStringToObjectId } from '../../../components/entities/utils/convertStringToObjectId';
import { makeJwtHandler } from '../../../components/usecases/utils/jwtHandler';
import { JoinedUserDoc } from '../../../models/User';

const jwtHandler = makeJwtHandler;

const verifyToken = (req: any, res: any, next: any) => {
  if (req.headers['x-requested-with'] && req.cookies.hp && req.cookies.sig) {
    const token = req.cookies.hp + req.cookies.sig;
    const decodedUser: JoinedUserDoc = jwtHandler.verify(token);
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
};

export { verifyToken };
