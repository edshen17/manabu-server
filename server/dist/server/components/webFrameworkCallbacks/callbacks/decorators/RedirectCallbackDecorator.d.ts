import { AbstractExpressCallback } from '../../abstractions/AbstractExpressCallback';
declare class RedirectCallbackDecorator extends AbstractExpressCallback {
    private abstractExpressCallback;
    constructor(abstractExpressCallback: AbstractExpressCallback);
    consumeTemplate: (res: any, body: any) => any;
}
export { RedirectCallbackDecorator };
