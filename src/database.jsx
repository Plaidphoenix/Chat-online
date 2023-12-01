import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyCit4Zb6t3CrQyaFFiaAGM9RT4N76wLrv8",
    authDomain: "chat-online-37529.firebaseapp.com",
    projectId: "chat-online-37529",
    storageBucket: "chat-online-37529.appspot.com",
    messagingSenderId: "972245185471",
    appId: "1:972245185471:web:6c1760c839f129f2ea670a"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default db;
