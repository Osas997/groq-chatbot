import * as Joi from 'joi';
import { config } from 'dotenv';
config();

export default Joi.object({
  DATABASE_HOST: Joi.string().required(),
  DATABASE_PORT: Joi.number().required(),
  DATABASE_USERNAME: Joi.string().required(),
  DATABASE_PASSWORD: Joi.string().allow(''),
  DATABASE_NAME: Joi.string().required(),
  DATABASE_SYNCHRONIZE: Joi.boolean().required(),
  DATABASE_AUTOLOAD: Joi.boolean().required(),
  GROQ_API_KEY: Joi.string().required(),
  GOOGLE_API_KEY: Joi.string().required(),
  JWT_SECRET: Joi.string().required(),
  JWT_REFRESH_SECRET: Joi.string().required(),
  JWT_ACCESS_TOKEN_TTL: Joi.string().required(),
  JWT_REFRESH_TOKEN_TTL: Joi.string().required(),
});
