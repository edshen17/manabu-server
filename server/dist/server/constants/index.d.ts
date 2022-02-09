/// <reference types="custom" />
import { StringKeyObject } from '../types/custom';
declare const DEFAULT_CURRENCY = "SGD";
declare const MANABU_ADMIN_EMAIL = "manabulessons@gmail.com";
declare const PAYOUT_RATE = 0.02;
declare const PAYMENT_GATEWAY_FEE: StringKeyObject;
declare enum MANABU_PROCESSING_RATE {
    UNLICENSED = 0.5,
    LICENSED = 0.16
}
declare const PACKAGE_DISCOUNT_RATE: (lessonAmount: number) => number;
declare const NODE_ENV: string;
declare const IS_PRODUCTION: boolean;
declare const G_CLIENTID: string;
declare const GOOGLE_CLIENT_SECRET: string;
declare const JWT_SECRET: string;
declare const MANABU_EMAIL_NOREPLY_PASS: string;
declare const MANABU_EMAIL_SUPPORT_PASS: string;
declare const MONGO_HOST: string;
declare const MONGO_PASS: string;
declare const OPEN_EXCHANGE_RATE_API_KEY: string;
declare const PAYPAL_CLIENT_ID: string;
declare const PAYPAL_CLIENT_SECRET: string;
declare const STRIPE_PUBLISHABLE_KEY: string;
declare const STRIPE_SECRET_KEY: string;
declare const REDIS_HOST: string;
declare const REDIS_PASS: string;
declare const REDIS_PORT: string;
declare const STRIPE_WEBHOOK_SECREY_KEY: string;
declare const MANABU_ADMIN_ID: string;
declare const MANABU_ADMIN_PKG_ID: string;
declare const OPEN_EXCHANGE_RATE_API_KEY_DEV: string;
declare const PAYPAL_CLIENT_ID_DEV: string;
declare const PAYPAL_CLIENT_SECRET_DEV: string;
declare const STRIPE_PUBLISHABLE_KEY_DEV: string;
declare const STRIPE_SECRET_KEY_DEV: string;
declare const PAYNOW_PUBLIC_KEY_DEV: string;
declare const PAYNOW_SECRET_KEY_DEV: string;
declare const STRIPE_WEBHOOK_SECREY_KEY_DEV: string;
declare const REDIS_HOST_DEV: string;
declare const REDIS_PASS_DEV: string;
declare const REDIS_PORT_DEV: string;
export { DEFAULT_CURRENCY, IS_PRODUCTION, MANABU_ADMIN_ID, PAYOUT_RATE, MANABU_ADMIN_PKG_ID, MANABU_PROCESSING_RATE, PACKAGE_DISCOUNT_RATE, G_CLIENTID, GOOGLE_CLIENT_SECRET, JWT_SECRET, MANABU_ADMIN_EMAIL, MANABU_EMAIL_NOREPLY_PASS, MANABU_EMAIL_SUPPORT_PASS, MONGO_HOST, MONGO_PASS, OPEN_EXCHANGE_RATE_API_KEY, PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET, STRIPE_PUBLISHABLE_KEY, STRIPE_SECRET_KEY, REDIS_HOST, REDIS_PASS, REDIS_PORT, NODE_ENV, PAYMENT_GATEWAY_FEE, STRIPE_WEBHOOK_SECREY_KEY, OPEN_EXCHANGE_RATE_API_KEY_DEV, PAYPAL_CLIENT_ID_DEV, PAYPAL_CLIENT_SECRET_DEV, STRIPE_PUBLISHABLE_KEY_DEV, STRIPE_SECRET_KEY_DEV, PAYNOW_PUBLIC_KEY_DEV, PAYNOW_SECRET_KEY_DEV, STRIPE_WEBHOOK_SECREY_KEY_DEV, REDIS_HOST_DEV, REDIS_PASS_DEV, REDIS_PORT_DEV, };
