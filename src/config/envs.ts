import 'dotenv/config';
import * as joi from 'joi';
import type { StringValue } from 'ms';

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
  AZURE_SERVICE_BUS_CONNECTION_STRING: string;
  AZURE_SERVICE_BUS_TOPIC: string;
  AZURE_SERVICE_BUS_SUBSCRIPTION: string;
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
    AZURE_SERVICE_BUS_CONNECTION_STRING: joi.string().required(),
    AZURE_SERVICE_BUS_TOPIC: joi.string().required(),
    AZURE_SERVICE_BUS_SUBSCRIPTION: joi.string().required(),
  })
  .unknown(true);

const result = envsSchema.validate(process.env);
if (result.error) {
  throw new Error(`Config validation error: ${result.error.message}`);
}
const envVars = result.value as EnvVars;

export const envs = {
  port: envVars.PORT,
  databaseurl: envVars.DATABASE_URL,
  firebaseProjectId: envVars.FIREBASE_PROJECT_ID,
  firebaseClientEmail: envVars.FIREBASE_CLIENT_EMAIL,
  firebasePrivateKey: envVars.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
  firebaseApiKey: envVars.VITE_FIREBASE_API_KEY,
  firebaseAuthDomain: envVars.VITE_FIREBASE_AUTH_DOMAIN,
  firebaseProjectIdFrontend: envVars.VITE_FIREBASE_PROJECT_ID,
  firebaseStorageBucket: envVars.VITE_FIREBASE_STORAGE_BUCKET,
  firebaseMessagingSenderId: envVars.VITE_FIREBASE_MESSAGING_SENDER_ID,
  firebaseAppId: envVars.VITE_FIREBASE_APP_ID,
  redisUrl: envVars.REDIS_URL,
  azureServiceBusConnectionString: envVars.AZURE_SERVICE_BUS_CONNECTION_STRING,
  azureServiceBusTopic: envVars.AZURE_SERVICE_BUS_TOPIC,
  azureServiceBusSubscription: envVars.AZURE_SERVICE_BUS_SUBSCRIPTION,
};
