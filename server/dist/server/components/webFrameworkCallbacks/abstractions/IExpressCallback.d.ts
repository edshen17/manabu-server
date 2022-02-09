import { IController } from '../../controllers/abstractions/IController';
interface IExpressCallback {
    consume: (makeController: Promise<IController<any>>) => (req: any, res: any) => Promise<void>;
}
export { IExpressCallback };
