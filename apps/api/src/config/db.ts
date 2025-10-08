import { drizzle as drizzleOrm } from 'drizzle-orm/node-postgres';
import { env } from './env';

export const drizzle = drizzleOrm(env.DATABASE_URL!);