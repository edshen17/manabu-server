import { IDbOperations } from './IDbOperations';
class TeachersDb<T> implements IDbOperations<T> {
  public connectedDb: any;
  private teacherModel: any;
  private clearKey: (keyName: string) => void;
  private clearSpecificKey: () => void;
  private updateSpecificKey: () => void;

  constructor(
    teacherModel: {},
    clearKey: (keyName: string) => void,
    clearSpecificKey: () => void,
    updateSpecificKey: () => void
  ) {
    this.teacherModel = teacherModel;
    this.clearKey = clearKey;
    this.clearSpecificKey = clearSpecificKey;
    this.updateSpecificKey = updateSpecificKey;
  }

  public findOne = async (attrObj: {}) => {
    const teacher = await this.teacherModel.findOne(attrObj).lean().cache();
    if (teacher) return teacher;
    else return null;
  };

  public insert = async () => {};
  public update = async () => {};
  public clearCollectionCache = (collection: string) => {
    this.clearKey(collection);
  };

  public build = async (dbPromise: () => Promise<T>) => {
    this.connectedDb = await dbPromise();
    return this;
  };
}
