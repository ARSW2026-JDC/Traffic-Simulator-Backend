import * as admin from 'firebase-admin';

let app: admin.app.App | null = null;

export function getFirebaseAdmin(): admin.app.App | null {
  if (app) return app;
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = (process.env.FIREBASE_PRIVATE_KEY || '').replace(/\\n/g, '\n');
  if (!projectId || !clientEmail || !privateKey) {
    console.warn('Backend: Firebase credentials not configured');
    return null;
  }
  app = admin.initializeApp(
    { credential: admin.credential.cert({ projectId, clientEmail, privateKey }) },
    'backend',
  );
  return app;
}
