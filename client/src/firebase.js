// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
 apiKey: import.meta.env.API_KEY,
  authDomain: import.meta.env.AUTH_DOMAIN,
  projectId: import.meta.env.PROJECT_ID,
  storageBucket: import.meta.env.STORAGE_BUCKET,
  messagingSenderId:import.meta.env.MESSAGE_SENDING_ID ,
  appId: import.meta.env.APP_ID,
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };
