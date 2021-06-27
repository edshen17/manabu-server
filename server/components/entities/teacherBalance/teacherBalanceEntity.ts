import { AbstractEntity } from '../abstractions/AbstractEntity';
import { IEntity } from '../abstractions/IEntity';

type TeacherBalanceEntityParams = { userId: string };

type TeacherBalanceEntityResponse = {
  userId: string;
  balanceDetails: {
    balance: number;
    currency: string;
  };
};

class TeacherBalanceEntity
  extends AbstractEntity<TeacherBalanceEntityResponse>
  implements IEntity<TeacherBalanceEntityResponse>
{
  build(entityData: TeacherBalanceEntityParams): any {
    const { userId } = entityData;
    return Object.freeze({
      userId,
      balanceDetails: {
        balance: 0,
        currency: 'SGD',
      },
    });
  }
}

export { TeacherBalanceEntity, TeacherBalanceEntityResponse };
