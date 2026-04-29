import 'dotenv/config';
import * as joi from 'joi';

interface EnvVars {
  PORT: number;
  DATABASE_URL: string;

  FIREBASE_PROJECT_ID: string;
  FIREBASE_CLIENT_EMAIL: string;
  FIREBASE_PRIVATE_KEY: string;
  VITE_FIREBASE_API_KEY: string;
  VITE_FIREBASE_AUTH_DOMAIN: string;
  VITE_FIREBASE_PROJECT_ID: string;
  VITE_FIREBASE_STORAGE_BUCKET: string;
  VITE_FIREBASE_MESSAGING_SENDER_ID: string;
  VITE_FIREBASE_APP_ID: string;

  GATEWAY_URL: string;
  REDIS_URL: string;
  ALLOWED_ORIGINS?: string;
}
const envsSchema = joi
  .object({
    PORT: joi.number().required(),
    DATABASE_URL: joi.string().required(),
    FIREBASE_PROJECT_ID: joi.string().required(),
    FIREBASE_CLIENT_EMAIL: joi.string().required(),
    FIREBASE_PRIVATE_KEY: joi.string().required(),
    VITE_FIREBASE_API_KEY: joi.string().required(),
    VITE_FIREBASE_AUTH_DOMAIN: joi.string().required(),
    VITE_FIREBASE_PROJECT_ID: joi.string().required(),
    VITE_FIREBASE_STORAGE_BUCKET: joi.string().required(),
    VITE_FIREBASE_MESSAGING_SENDER_ID: joi.string().required(),
    VITE_FIREBASE_APP_ID: joi.string().required(),
    GATEWAY_URL: joi.string().required(),
    REDIS_URL: joi.string().required(),
    ALLOWED_ORIGINS: joi.string().optional(),
  })
  .unknown(true);

let envVarsCache: EnvVars | null = null;

function getEnvVars(): EnvVars {
  if (envVarsCache) return envVarsCache;
  const result = envsSchema.validate(process.env);
  if (result.error) {
    throw new Error(`Config validation error: ${result.error.message}`);
  }
  envVarsCache = result.value as EnvVars;
  return envVarsCache;
}

export const envs = {
  get port() {
    return getEnvVars().PORT;
  },
  get databaseurl() {
    return getEnvVars().DATABASE_URL;
  },
  get firebaseProjectId() {
    return getEnvVars().FIREBASE_PROJECT_ID;
  },
  get firebaseClientEmail() {
    return getEnvVars().FIREBASE_CLIENT_EMAIL;
  },
  get firebasePrivateKey() {
    return getEnvVars().FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n');
  },
  get firebaseApiKey() {
    return getEnvVars().VITE_FIREBASE_API_KEY;
  },
  get firebaseAuthDomain() {
    return getEnvVars().VITE_FIREBASE_AUTH_DOMAIN;
  },
  get firebaseProjectIdFrontend() {
    return getEnvVars().VITE_FIREBASE_PROJECT_ID;
  },
  get firebaseStorageBucket() {
    return getEnvVars().VITE_FIREBASE_STORAGE_BUCKET;
  },
  get firebaseMessagingSenderId() {
    return getEnvVars().VITE_FIREBASE_MESSAGING_SENDER_ID;
  },
  get firebaseAppId() {
    return getEnvVars().VITE_FIREBASE_APP_ID;
  },
  get redisUrl() {
    return getEnvVars().REDIS_URL;
  },
  get allowedOrigins() {
    return (
      getEnvVars().ALLOWED_ORIGINS?.split(',') || ['http://localhost:5173']
    );
  },
};
