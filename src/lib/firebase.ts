import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA6khMn9y68FmC8ypvskeCeyh64FFtKB6w",
  authDomain: "glassy-union-kcf5x.firebaseapp.com",
  projectId: "glassy-union-kcf5x",
  storageBucket: "glassy-union-kcf5x.firebasestorage.app",
  messagingSenderId: "600417027919",
  appId: "1:600417027919:web:a85065461cc95808ece73a"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, "ai-studio-f39d9cbe-a1ad-4cb6-b456-a8480b0328cf");
