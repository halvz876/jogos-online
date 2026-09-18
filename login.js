import { auth, db } from "./firebase-config.js";
import { signInWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
document.addEventListener('DOMContentLoaded',()=>{
 const login=document.getElementById('view-login'), register=document.getElementById('view-register'), home=document.getElementById('view-home'), nav=document.getElementById('main-navbar');
 const showHome=()=>{login?.classList.add('hidden');register?.classList.add('hidden');home?.classList.remove('hidden');nav?.classList.remove('hidden')};
 document.getElementById('toggle-password')?.addEventListener('click',()=>{const i=document.getElementById('login-password'),t=i.type==='password'?'text':'password';i.type=t;document.getElementById('toggle-password').classList.toggle('fa-eye-slash')});
 document.getElementById('btn-create-account')?.addEventListener('click',()=>{login.classList.add('hidden');register.classList.remove('hidden')});
 document.getElementById('btn-back-to-login')?.addEventListener('click',()=>{register.classList.add('hidden');login.classList.remove('hidden')});
 document.getElementById('login-form')?.addEventListener('submit',async e=>{e.preventDefault();try{await signInWithEmailAndPassword(auth,document.getElementById('login-email').value.trim(),document.getElementById('login-password').value);showHome();}catch(err){alert('Erro ao fazer login: '+err.message)}});
 if(new URLSearchParams(location.search).get('view')==='home')showHome();
 onAuthStateChanged(auth,async user=>{if(!user)return;document.getElementById('user-email').textContent=user.email||'Sem e-mail';let nome=localStorage.getItem('nickname')||user.displayName||user.email.split('@')[0];try{const snap=await getDoc(doc(db,'usuarios',user.uid));if(snap.exists())nome=snap.data().nome||nome}catch(e){}document.getElementById('user-nickname').textContent=nome;
 const email=(user.email||'').toLowerCase();
 if(email==='halvz876@gmail.com'){ const link=document.getElementById('menu-link-planilha'); link?.classList.remove('hidden'); document.getElementById('user-nickname').title='Administrador nível 2'; const role=document.getElementById('user-role'); if(role) role.innerHTML='<i class="fa-solid fa-shield-halved"></i> administrador nível 2'; }
 if(new URLSearchParams(location.search).get('view')==='home')showHome()});
 document.getElementById('btn-logout')?.addEventListener('click',async e=>{e.preventDefault();await auth.signOut();location.href='index.html'});
});
