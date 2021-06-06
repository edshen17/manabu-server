import { AbstractEntity } from '../abstractions/AbstractEntity';
import { IEntity } from '../abstractions/IEntity';

class TeacherBalanceEntity extends AbstractEntity implements IEntity {
  build(entityData: { userId: string }): any {
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

export { TeacherBalanceEntity };
