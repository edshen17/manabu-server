import { AbstractExpressCallback } from '../../abstractions/AbstractExpressCallback';
declare class CookieCallbackDecorator extends AbstractExpressCallback {
    private abstractExpressCallback;
    constructor(abstractExpressCallback: AbstractExpressCallback);
    consumeTemplate: (res: any, body: any) => void;
}
export { CookieCallbackDecorator };
