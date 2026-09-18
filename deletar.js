import { auth, db } from "./firebase-config.js";
import { EmailAuthProvider, reauthenticateWithCredential, deleteUser } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { doc, deleteDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

document.addEventListener("DOMContentLoaded", () => {
    const btnDeletarConta = document.getElementById("btnDeletarConta");
    const inputEmail = document.getElementById("emailDeletar");
    const inputSenha = document.getElementById("senhaDeletar");
    const toggleSenha = document.getElementById("toggleSenhaDeletar");

    if (toggleSenha && inputSenha) {
        toggleSenha.addEventListener("click", () => {
            const tipo = inputSenha.getAttribute("type") === "password" ? "text" : "password";
            inputSenha.setAttribute("type", tipo);
            toggleSenha.textContent = tipo === "password" ? "👁️" : "🙈";
        });
    }

    if (btnDeletarConta) {
        btnDeletarConta.addEventListener("click", async (e) => {
            e.preventDefault();
            const email = inputEmail.value.trim();
            const senha = inputSenha.value;

            if (!email || !senha) {
                alert("Preencha o e-mail e a senha.");
                return;
            }

            const usuarioAtual = auth.currentUser;
            if (!usuarioAtual) {
                alert("Faça login primeiro para excluir sua conta.");
                window.location.href = "index.html";
                return;
            }

            if (confirm("Deseja realmente excluir sua conta?")) {
                try {
                    const credencial = EmailAuthProvider.credential(email, senha);
                    await reauthenticateWithCredential(usuarioAtual, credencial);
                    await deleteDoc(doc(db, "usuarios", usuarioAtual.uid));
                    await deleteUser(usuarioAtual);
                    alert("Conta excluída!");
                    window.location.href = "index.html";
                } catch (error) {
                    alert("Erro ao excluir: " + error.message);
                }
            }
        });
    }
});