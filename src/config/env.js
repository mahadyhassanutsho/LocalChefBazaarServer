import { configDotenv } from "dotenv";

configDotenv({ path: ".env.local" });

export const type = process.env.FIREBASE_TYPE;
export const projectId = process.env.FIREBASE_PROJECT_ID;
export const privateKeyId = process.env.FIREBASE_PRIVATE_KEY_ID;
export const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(
  /\\n/g,
  "\n"
);
export const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
export const clientId = process.env.FIREBASE_CLIENT_ID;
export const authUri = process.env.FIREBASE_AUTH_URI;
export const tokenUri = process.env.FIREBASE_TOKEN_URI;
export const authProviderCertUrl = process.env.FIREBASE_AUTH_PROVIDER_CERT_URL;
export const clientCertUrl = process.env.FIREBASE_CLIENT_CERT_URL;

export const mongoURI = process.env.MONGO_URI;

export const port = process.env.PORT;
