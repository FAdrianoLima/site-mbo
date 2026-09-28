const admin = require("firebase-admin");

if (!admin.apps.length) {
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");

  if (!process.env.FIREBASE_PROJECT_ID) {
    throw new Error("FIREBASE_PROJECT_ID não configurada.");
  }

  if (!process.env.FIREBASE_CLIENT_EMAIL) {
    throw new Error("FIREBASE_CLIENT_EMAIL não configurada.");
  }

  if (!privateKey) {
    throw new Error("FIREBASE_PRIVATE_KEY não configurada.");
  }

  console.log("🔥 Firebase Project:", process.env.FIREBASE_PROJECT_ID);
  console.log("🔥 Firebase Client:", process.env.FIREBASE_CLIENT_EMAIL);

  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey,
    }),
  });
}

module.exports = admin;
