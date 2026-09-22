import { config } from './validate.config';

// app
const APP_PORT = config.get<string>('APP_PORT') ?? 1721;

//database
const DATABASE_URL = config.get<string>('DATABASE_URL') ?? '';

//jwt
const JWT_ACCESS_SECRET = config.get<string>('JWT_ACCESS_SECRET') ?? '';
const JWT_REFRESH_SECRET = config.get<string>('JWT_REFRESH_SECRET') ?? '';
const JWT_ACCESS_EXPIRE_TIME = +(config.get<number>('JWT_ACCESS_EXPIRE_TIME') ?? 86400);
const JWT_REFRESH_EXPIRE_TIME = +(config.get<number>('JWT_REFRESH_EXPIRE_TIME') ?? 864000);

// decorator
const ROLES_DECORATOR_KEY = config.get<string>('ROLES_DECORATOR_KEY') ?? '';

//Seed Datas
const ADMIN_EMAIL = config.get<string>('ADMIN_EMAIL') ?? '';
const ADMIN_PASSWORD = config.get<string>('ADMIN_PASSWORD') ?? '';

// Redis
const REDIS_HOST = config.get<string>('REDIS_HOST') ?? ""
const REDIS_PORT = +(config.get<number>('REDIS_PORT') ?? 6379)
const REDIS_PASSWORD = config.get<string>('REDIS_PASSWORD') ?? ""


export {
  APP_PORT,
  DATABASE_URL,
  JWT_ACCESS_SECRET,
  JWT_REFRESH_SECRET,
  JWT_ACCESS_EXPIRE_TIME,
  JWT_REFRESH_EXPIRE_TIME,
  ROLES_DECORATOR_KEY,
  ADMIN_EMAIL,
  ADMIN_PASSWORD,
  REDIS_HOST,
  REDIS_PORT,
  REDIS_PASSWORD
};
