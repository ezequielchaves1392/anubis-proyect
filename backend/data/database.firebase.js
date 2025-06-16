// backend/data/database.firebase.js
const admin = require("firebase-admin");
admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  // o usa archivo de credenciales json
});
const db = admin.firestore();

module.exports = {
  getUsers: async () => {
    const snapshot = await db.collection("users").get();
    return snapshot.docs.map((doc) => doc.data());
  },
  addUser: async (user) => {
    await db.collection("users").add(user);
  },
};
