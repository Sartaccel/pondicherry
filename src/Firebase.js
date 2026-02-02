import { initializeApp } from "firebase/app";
import { getMessaging } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "1ed310d1d3b6e42d9d55fdfc3444c9b2f8cc0d75",
  authDomain: "bellybutton-6b338.firebaseapp.com",
  projectId: "bellybutton-6b338",
  messagingSenderId: "106549345763",
  appId: "1:106549345763:web:abc123xyz456"
};

const app = initializeApp(firebaseConfig);
export const messaging = getMessaging(app);
