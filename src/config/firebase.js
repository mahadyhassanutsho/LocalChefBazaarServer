import admin from "firebase-admin";

import {
  type,
  projectId,
  privateKeyId,
  privateKey,
  clientEmail,
  clientId,
  authUri,
  tokenUri,
  authProviderCertUrl,
  clientCertUrl,
} from "./env.js";

admin.initializeApp({
  credential: admin.credential.cert({
    type,
    project_id: projectId,
    private_key_id: privateKeyId,
    private_key: privateKey,
    client_email: clientEmail,
    client_id: clientId,
    auth_uri: authUri,
    token_uri: tokenUri,
    auth_provider_x509_cert_url: authProviderCertUrl,
    client_x509_cert_url: clientCertUrl,
  }),
});

export default admin;
