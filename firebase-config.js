// Importe os SDKs necessários do Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Suas credenciais reais do projeto do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAgTyyPHmDKoeiASGh986VboKoQ9EQNn38",
  authDomain: "bancodedados-6a371.firebaseapp.com",
  projectId: "bancodedados-6a371",
  storageBucket: "bancodedados-6a371.firebasestorage.app",
  messagingSenderId: "982595529125",
  appId: "1:982595529125:web:cb819182abea81a94da04c",
  measurementId: "G-0GWC6KWSGW"
};

// Inicializa o Firebase e exporta para o restante do site
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);