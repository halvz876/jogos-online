import { auth, db } from "./firebase-config.js";
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

document.addEventListener('DOMContentLoaded', () => {
 const login = document.getElementById('view-login'), 
       register = document.getElementById('view-register'), 
       home = document.getElementById('view-home'), 
       nav = document.getElementById('main-navbar');

 const showHome = () => {
   login?.classList.add('hidden');
   register?.classList.add('hidden');
   home?.classList.remove('hidden');
   nav?.classList.remove('hidden');
 };

 // Lógica de Olhinho na Senha
 document.getElementById('toggle-password')?.addEventListener('click', () => {
   const i = document.getElementById('login-password');
   if (i) {
     i.type = i.type === 'password' ? 'text' : 'password';
     document.getElementById('toggle-password')?.classList.toggle('fa-eye-slash');
   }
 });

 // Alternar Telas
 document.getElementById('btn-create-account')?.addEventListener('click', () => {
   login?.classList.add('hidden');
   register?.classList.remove('hidden');
 });

 document.getElementById('btn-back-to-login')?.addEventListener('click', () => {
   register?.classList.add('hidden');
   login?.classList.remove('hidden');
 });

 // SUBMIT DO LOGIN
 document.getElementById('login-form')?.addEventListener('submit', async e => {
   e.preventDefault();
   try {
     await signInWithEmailAndPassword(
       auth,
       document.getElementById('login-email').value.trim(),
       document.getElementById('login-password').value
     );
     showHome();
   } catch (err) {
     alert('Erro ao fazer login: ' + err.message);
   }
 });

 // SUBMIT DO CADASTRO (Novo usuário)
 document.getElementById('register-form')?.addEventListener('submit', async e => {
   e.preventDefault();
   const username = document.getElementById('reg-username').value.trim();
   const email = document.getElementById('reg-email').value.trim();
   const password = document.getElementById('reg-password').value;

   try {
     const userCredential = await createUserWithEmailAndPassword(auth, email, password);
     const user = userCredential.user;

     // Salva o usuário na coleção "usuarios" do Firestore
     await setDoc(doc(db, 'usuarios', user.uid), {
       nome: username,
       email: email,
       criadoEm: new Date()
     });

     localStorage.setItem('nickname', username);
     alert('Conta criada com sucesso!');
     showHome();
   } catch (err) {
     alert('Erro ao criar conta: ' + err.message);
   }
 });

 if (new URLSearchParams(location.search).get('view') === 'home') showHome();

 // VERIFICAÇÃO DO ESTADO DE AUTENTICAÇÃO
 onAuthStateChanged(auth, async user => {
   if (!user) return;
   
   document.getElementById('user-email').textContent = user.email || 'Sem e-mail';
   let nome = localStorage.getItem('nickname') || user.displayName || user.email.split('@')[0];
   
   try {
     const snap = await getDoc(doc(db, 'usuarios', user.uid));
     if (snap.exists()) nome = snap.data().nome || nome;
   } catch (e) {}

   document.getElementById('user-nickname').textContent = nome;

   const email = (user.email || '').toLowerCase();
   if (email === 'halvz876@gmail.com') {
     const link = document.getElementById('menu-link-planilha');
     link?.classList.remove('hidden');
     document.getElementById('user-nickname').title = 'Administrador nível 2';
     const role = document.getElementById('user-role');
     if (role) role.innerHTML = '<i class="fa-solid fa-shield-halved"></i> administrador nível 2';
   }

   if (new URLSearchParams(location.search).get('view') === 'home') showHome();
 });

 // LOGOUT
 document.getElementById('btn-logout')?.addEventListener('click', async e => {
   e.preventDefault();
   await auth.signOut();
   location.href = 'index.html';
 });
});