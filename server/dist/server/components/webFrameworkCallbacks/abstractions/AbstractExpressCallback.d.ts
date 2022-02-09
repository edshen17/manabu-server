import { IController } from '../../controllers/abstractions/IController';
import { IExpressCallback } from './IExpressCallback';
declare abstract class AbstractExpressCallback implements IExpressCallback {
    abstract consumeTemplate(res: any, body: any): void;
    consume: (makeController: Promise<IController<any>>) => (req: any, res: any) => Promise<void>;
    private _createHttpRequest;
}
export { AbstractExpressCallback };
