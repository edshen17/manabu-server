import { AbstractExpressCallback } from '../../abstractions/AbstractExpressCallback';
declare class JSONCallbackDecorator extends AbstractExpressCallback {
    private abstractExpressCallback;
    constructor(abstractExpressCallback: AbstractExpressCallback);
    consumeTemplate: (res: any, body: any) => void;
}
export { JSONCallbackDecorator };
