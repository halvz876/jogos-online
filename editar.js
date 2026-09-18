// CERTO (aponta para o firebase-config.js no mesmo diretório)
import { auth, db } from "./firebase-config.js";
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { doc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

let usuarioEditandoUid = null;

document.getElementById("btnCarregarDados").addEventListener("click", async () => {
    const email = document.getElementById("editEmailAuth").value;
    const senha = document.getElementById("editSenhaAuth").value;

    if (!email || !senha) {
        alert("Por favor, preencha o e-mail e a senha para autenticar.");
        return;
    }

    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, senha);
        usuarioEditandoUid = userCredential.user.uid;

        const docRef = doc(db, "usuarios", usuarioEditandoUid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            document.getElementById("editNome").value = docSnap.data().nome;
            document.getElementById("editNome").disabled = false;
            document.getElementById("btnAtualizar").disabled = false;
            alert("Dados carregados com sucesso! Agora você pode alterar o nome.");
        } else {
            alert("Dados não encontrados no Firestore.");
        }
    } catch (error) {
        alert("Erro ao autenticar/buscar dados: " + error.message);
    }
});

document.getElementById("formEditar").addEventListener("submit", async (e) => {
    e.preventDefault();

    if (!usuarioEditandoUid) return;

    const novoNome = document.getElementById("editNome").value;

    try {
        const docRef = doc(db, "usuarios", usuarioEditandoUid);
        await updateDoc(docRef, { nome: novoNome });

        alert("Registro atualizado com sucesso!");
        document.getElementById("formEditar").reset();
        document.getElementById("editNome").disabled = true;
        document.getElementById("btnAtualizar").disabled = true;
        usuarioEditandoUid = null;
    } catch (error) {
        alert("Erro ao atualizar o registro: " + error.message);
    }
});