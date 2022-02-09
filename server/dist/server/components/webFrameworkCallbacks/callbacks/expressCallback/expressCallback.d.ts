import { AbstractExpressCallback } from '../../abstractions/AbstractExpressCallback';
declare class ExpressCallback extends AbstractExpressCallback {
    consumeTemplate: (res: any, body: any) => void;
}
export { ExpressCallback };
