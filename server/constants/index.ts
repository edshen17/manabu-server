import { StringKeyObject } from '../types/custom';

const DEFAULT_CURRENCY = 'SGD';
const MANABU_ADMIN_EMAIL = 'manabulessons@gmail.com';
const PAYOUT_RATE = 0.02;
const PAYMENT_GATEWAY_FEE: StringKeyObject = {
  PAYPAL: (subtotal: number) => {
    return 0.044 * subtotal + 0.5;
  },
  STRIPE: (subtotal: number) => {
    return 0.034 * subtotal + 0.5;
  },
  PAYNOW: (subtotal: number) => {
    return 0.01 * subtotal;
  },
};
enum MANABU_PROCESSING_RATE {
  UNLICENSED = 0.5,
  LICENSED = 0.16,
}

const PACKAGE_DISCOUNT_RATE = (lessonAmount: number) => {
  let discountRate;
  if (lessonAmount <= 5) {
    discountRate = 0;
  } else if (lessonAmount > 5 && lessonAmount < 20) {
    discountRate = lessonAmount * 0.004166;
  } else {
    discountRate = lessonAmount * 0.005;
  }
  const roundedDiscountRate = Math.round((discountRate + Number.EPSILON) * 100) / 100;
  return roundedDiscountRate;
};

const NODE_ENV = process.env.NODE_ENV!;
const IS_PRODUCTION = NODE_ENV == 'production';
const G_CLIENTID = process.env.G_CLIENTID!;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET!;
const JWT_SECRET = process.env.JWT_SECRET!;
const MANABU_EMAIL_NOREPLY_PASS = process.env.MANABU_EMAIL_NOREPLY_PASS!;
const MANABU_EMAIL_SUPPORT_PASS = process.env.MANABU_EMAIL_SUPPORT_PASS!;
const MONGO_HOST = process.env.MONGO_HOST!;
const MONGO_PASS = process.env.MONGO_PASS!;
const OPEN_EXCHANGE_RATE_API_KEY = process.env.OPEN_EXCHANGE_RATE_API_KEY!;
const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID!;
const PAYPAL_CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET!;
const STRIPE_PUBLISHABLE_KEY = process.env.STRIPE_PUBLISHABLE_KEY!;
const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY!;
const REDIS_HOST = process.env.REDIS_HOST!;
const REDIS_PASS = process.env.REDIS_PASS!;
const REDIS_PORT = process.env.REDIS_PORT!;
const STRIPE_WEBHOOK_SECRET_KEY = process.env.STRIPE_WEBHOOK_SECRET_KEY!;
const MANABU_ADMIN_ID = process.env.MANABU_ADMIN_ID!;
const MANABU_ADMIN_PKG_ID = process.env.MANABU_ADMIN_PKG_ID!;
const REDIS_JSON_URL = process.env.REDIS_JSON_URL!;
const GCS_KEYFILE = process.env.GCS_KEYFILE!;
const MIX_PANEL_TOKEN = IS_PRODUCTION
  ? process.env.MIX_PANEL_TOKEN!
  : process.env.MIX_PANEL_TOKEN_DEV!;

// DEV
const OPEN_EXCHANGE_RATE_API_KEY_DEV = process.env.OPEN_EXCHANGE_RATE_API_KEY_DEV!;
const PAYPAL_CLIENT_ID_DEV = process.env.PAYPAL_CLIENT_ID_DEV!;
const PAYPAL_CLIENT_SECRET_DEV = process.env.PAYPAL_CLIENT_SECRET_DEV!;
const STRIPE_PUBLISHABLE_KEY_DEV = process.env.STRIPE_PUBLISHABLE_KEY_DEV!;
const STRIPE_SECRET_KEY_DEV = process.env.STRIPE_SECRET_KEY_DEV!;
const PAYNOW_PUBLIC_KEY_DEV = process.env.PAYNOW_PUBLIC_KEY_DEV!;
const PAYNOW_SECRET_KEY_DEV = process.env.PAYNOW_SECRET_KEY_DEV!;
const STRIPE_WEBHOOK_SECRET_KEY_DEV = process.env.STRIPE_WEBHOOK_SECRET_KEY_DEV!;
const REDIS_HOST_DEV = process.env.REDIS_HOST_DEV!;
const REDIS_PASS_DEV = process.env.REDIS_PASS_DEV!;
const REDIS_PORT_DEV = process.env.REDIS_PORT_DEV!;

export {
  DEFAULT_CURRENCY,
  IS_PRODUCTION,
  MANABU_ADMIN_ID,
  PAYOUT_RATE,
  MANABU_ADMIN_PKG_ID,
  MANABU_PROCESSING_RATE,
  PACKAGE_DISCOUNT_RATE,
  GCS_KEYFILE,
  G_CLIENTID,
  GOOGLE_CLIENT_SECRET,
  JWT_SECRET,
  MANABU_ADMIN_EMAIL,
  MANABU_EMAIL_NOREPLY_PASS,
  MANABU_EMAIL_SUPPORT_PASS,
  MONGO_HOST,
  MONGO_PASS,
  OPEN_EXCHANGE_RATE_API_KEY,
  REDIS_JSON_URL,
  PAYPAL_CLIENT_ID,
  PAYPAL_CLIENT_SECRET,
  STRIPE_PUBLISHABLE_KEY,
  STRIPE_SECRET_KEY,
  REDIS_HOST,
  REDIS_PASS,
  REDIS_PORT,
  NODE_ENV,
  PAYMENT_GATEWAY_FEE,
  STRIPE_WEBHOOK_SECRET_KEY,
  OPEN_EXCHANGE_RATE_API_KEY_DEV,
  PAYPAL_CLIENT_ID_DEV,
  PAYPAL_CLIENT_SECRET_DEV,
  STRIPE_PUBLISHABLE_KEY_DEV,
  STRIPE_SECRET_KEY_DEV,
  PAYNOW_PUBLIC_KEY_DEV,
  PAYNOW_SECRET_KEY_DEV,
  STRIPE_WEBHOOK_SECRET_KEY_DEV,
  REDIS_HOST_DEV,
  REDIS_PASS_DEV,
  REDIS_PORT_DEV,
  MIX_PANEL_TOKEN,
};
