import { config } from './validate.config';

// app
const APP_PORT = config.get<string>('APP_PORT') ?? 1721;

//database
const DATABASE_URL = config.get<string>('DATABASE_URL') ?? ''

//jwt
const JWT_ACCESS_SECRET = config.get<string>('JWT_ACCESS_SECRET') ?? '';
const JWT_REFRESH_SECRET = config.get<string>('JWT_REFRESH_SECRET') ?? '';
const JWT_ACCESS_EXPIRE_TIME = config.get<string>('JWT_ACCESS_EXPIRE_TIME') ?? '15m';
const JWT_REFRESH_EXPIRE_TIME = config.get<string>('JWT_REFRESH_EXPIRE_TIME') ?? '7d';

const ROLES_DECORATOR_KEY = config.get<string>('ROLES_DECORATOR_KEY') ?? '';

export {
  APP_PORT,
  DATABASE_URL,
  JWT_ACCESS_SECRET,
  JWT_REFRESH_SECRET,
  JWT_ACCESS_EXPIRE_TIME,
  JWT_REFRESH_EXPIRE_TIME,
  ROLES_DECORATOR_KEY,
};