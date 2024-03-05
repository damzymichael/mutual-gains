import zod from 'zod';

const envSchema = zod.object({
  DATABASE_URL: zod.string().min(1),
  ADMIN_EMAIL: zod.string().min(1),
  ADMIN_PASSWORD: zod.string().min(1),
  JWT_SECRET: zod.string().min(1)
});

const env = envSchema.parse(process.env);

export default env;
