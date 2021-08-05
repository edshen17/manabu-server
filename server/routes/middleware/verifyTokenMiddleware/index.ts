import jwt from 'jsonwebtoken';
import { convertStringToObjectId } from '../../../components/entities/utils/convertStringToObjectId';
import { JoinedUserDoc } from '../../../models/User';

const verifyToken = (req: any, res: any, next: any) => {
  if (req.headers['x-requested-with'] && req.cookies.hp && req.cookies.sig) {
    const token = req.cookies.hp + req.cookies.sig;
    const decoded = <JoinedUserDoc>jwt.verify(token, process.env.JWT_SECRET!);
    if (!decoded) {
      throw new Error('Invalid jwt format.');
    }
    req.userId = convertStringToObjectId(decoded._id);
    req.role = decoded.role || 'user';
    if (decoded.teacherData) {
      req.teacherId = convertStringToObjectId(decoded.teacherData._id);
    }
  }
  next();
};

export { verifyToken };
