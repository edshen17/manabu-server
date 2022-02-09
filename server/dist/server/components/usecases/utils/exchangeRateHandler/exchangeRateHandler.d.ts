import { Axios } from 'axios';
import { StringKeyObject } from '../../../../types/custom';
import { CacheDbService } from '../../../dataAccess/services/cache/cacheDbService';
declare type ArithmeticCurrencyObj = {
    amount: number;
    sourceCurrency?: string;
};
declare class ExchangeRateHandler {
    private _axios;
    private _cacheDbService;
    private _fx;
    private _currency;
    getRates: () => Promise<StringKeyObject>;
    private _getExchangeRateAPIUrl;
    convert: (props: {
        amount: number;
        sourceCurrency: string;
        targetCurrency: string;
    }) => Promise<number>;
    add: (props: {
        addend1: ArithmeticCurrencyObj;
        addend2: ArithmeticCurrencyObj;
        targetCurrency: string;
    }) => Promise<number>;
    subtract: (props: {
        minuend: ArithmeticCurrencyObj;
        subtrahend: ArithmeticCurrencyObj;
        targetCurrency: string;
    }) => Promise<number>;
    multiply: (props: {
        multiplicand: ArithmeticCurrencyObj;
        multiplier: ArithmeticCurrencyObj;
        targetCurrency: string;
    }) => Promise<number>;
    toCurrency: (num: number) => number;
    init: (props: {
        axios: Axios;
        makeCacheDbService: Promise<CacheDbService>;
        money: any;
        currency: any;
    }) => Promise<this>;
}
export { ExchangeRateHandler };
