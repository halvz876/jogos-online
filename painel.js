import { db, auth } from "./firebase-config.js";
import { collection, onSnapshot, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

let usuariosListaOriginal = [];
let nivelUsuarioAtual = 'usuario';

document.addEventListener("DOMContentLoaded", () => {
  const tema = localStorage.getItem('theme');
  const modoEscuro = localStorage.getItem('modoEscuro');

  if (tema === 'light' || modoEscuro === 'false' || modoEscuro === false) {
    document.body.classList.add('light-theme');
  } else {
    document.body.classList.remove('light-theme');
  }

  const btnVoltar = document.getElementById('btn-voltar-link');
  if (btnVoltar) {
    btnVoltar.addEventListener('click', (e) => {
      e.preventDefault();
      window.location.href = './index.html?view=home';
    });
  }

  const tabelaUsuarios = document.getElementById('tabela-usuarios');
  const inputBusca = document.getElementById('input-busca-email');
  const selectOrdenar = document.getElementById('select-ordenar');

  if (!tabelaUsuarios) return;

  onAuthStateChanged(auth, (user) => {
    if (user && user.email) {
      const emailLogado = user.email.toLowerCase().trim();

      if (emailLogado === 'halvz876@gmail.com') {
        nivelUsuarioAtual = 'adm2';
      } else if (emailLogado === 'henriquealvesribeiro882@gmail.com') {
        nivelUsuarioAtual = 'adm1';
      } else {
        nivelUsuarioAtual = 'usuario';
      }
    }

    escutarFirestoreEmTempoReal(tabelaUsuarios);
  });

  if (inputBusca) {
    inputBusca.addEventListener('input', () => renderizarTabela(tabelaUsuarios));
    inputBusca.addEventListener('keyup', () => renderizarTabela(tabelaUsuarios));
  }

  if (selectOrdenar) {
    selectOrdenar.addEventListener('change', () => renderizarTabela(tabelaUsuarios));
  }
});

function escutarFirestoreEmTempoReal(tabelaUsuarios) {
  tabelaUsuarios.innerHTML = '<tr><td colspan="4" style="text-align: center; padding: 20px;">Conectando ao banco...</td></tr>';

  onSnapshot(collection(db, "usuarios"), (querySnapshot) => {
    usuariosListaOriginal = [];

    querySnapshot.forEach((documento) => {
      const data = documento.data();
      
      let timestampCriacao = 0;
      if (data.criadoEm) {
        if (typeof data.criadoEm.toMillis === 'function') {
          timestampCriacao = data.criadoEm.toMillis();
        } else if (typeof data.criadoEm === 'number') {
          timestampCriacao = data.criadoEm;
        } else if (typeof data.criadoEm === 'string') {
          timestampCriacao = new Date(data.criadoEm).getTime() || 0;
        }
      }

      usuariosListaOriginal.push({
        id: documento.id,
        nome: data.nome || data.Nome || data.username || 'Sem nome',
        email: data.email || data.Email || 'Sem e-mail',
        nivel: data.nivel || data.Nivel || 'usuario',
        criadoEm: timestampCriacao
      });
    });

    renderizarTabela(tabelaUsuarios);

  }, (error) => {
    console.error("Erro no Firestore:", error);
    tabelaUsuarios.innerHTML = `<tr><td colspan="4" style="text-align: center; color: #ef4444; padding: 20px;">
      Erro ao carregar dados.<br><small>${error.message}</small>
    </td></tr>`;
  });
}

function renderizarTabela(tabelaUsuarios) {
  const inputEl = document.getElementById('input-busca-email');
  const termoBusca = (inputEl ? inputEl.value : '').toLowerCase().trim();
  const opcaoOrdenacao = document.getElementById('select-ordenar')?.value || 'nome-asc';

  let listaFiltrada = usuariosListaOriginal.filter(u => 
    u.email.toLowerCase().includes(termoBusca) || 
    u.nome.toLowerCase().includes(termoBusca)
  );

  listaFiltrada.sort((a, b) => {
    if (opcaoOrdenacao === 'nome-asc') return a.nome.localeCompare(b.nome);
    if (opcaoOrdenacao === 'nome-desc') return b.nome.localeCompare(a.nome);
    if (opcaoOrdenacao === 'data-desc') return b.criadoEm - a.criadoEm;
    if (opcaoOrdenacao === 'data-asc') return a.criadoEm - b.criadoEm;
    return 0;
  });

  atualizarContadorUsuarios(listaFiltrada.length);

  tabelaUsuarios.innerHTML = '';

  if (listaFiltrada.length === 0) {
    tabelaUsuarios.innerHTML = `
      <tr>
        <td colspan="4" style="text-align: center; padding: 25px; color: #e53e3e; font-weight: 500;">
          <i class="fa-solid fa-circle-exclamation"></i> Nenhum usuário encontrado.
        </td>
      </tr>`;
    return;
  }

  listaFiltrada.forEach((u) => {
    const tr = document.createElement('tr');
    const podeDeletar = (nivelUsuarioAtual === 'adm2');

    tr.innerHTML = `
      <td><strong>${u.nome}</strong></td>
      <td>${u.email}</td>
      <td><span class="badge-nivel badge-${u.nivel}">${u.nivel}</span></td>
      <td>
        <button class="btn-excluir" ${!podeDeletar ? 'disabled style="opacity:0.3; cursor:not-allowed;" title="Apenas ADM nível 2 pode excluir"' : ''}>
          Excluir <i class="fa-solid fa-trash"></i>
        </button>
      </td>
    `;

    const btnExcluir = tr.querySelector('.btn-excluir');
    if (podeDeletar && btnExcluir) {
      btnExcluir.addEventListener('click', () => deletarNoFirestore(u.id, u.nome));
    }

    tabelaUsuarios.appendChild(tr);
  });
}

function atualizarContadorUsuarios(total) {
  let contadorEl = document.getElementById('contador-usuarios');
  
  if (!contadorEl) {
    const tituloTabela = document.querySelector('h1');
    contadorEl = document.createElement('div');
    contadorEl.id = 'contador-usuarios';
    contadorEl.style.cssText = 'margin-bottom: 15px; font-size: 15px; color: var(--text-sub); font-weight: 500;';
    
    if (tituloTabela) {
      tituloTabela.insertAdjacentElement('afterend', contadorEl);
    } else {
      document.body.prepend(contadorEl);
    }
  }

  contadorEl.innerHTML = `<i class="fa-solid fa-users"></i> Usuários exibidos: <strong>${total}</strong>`;
}

async function deletarNoFirestore(id, nome) {
  if (nivelUsuarioAtual !== 'adm2') {
    alert("Ação não permitida. Apenas o administrador nível 2 pode excluir usuários.");
    return;
  }

  const confirmacao = confirm(`Deseja excluir "${nome}" permanentemente do banco?`);
  if (!confirmacao) return;

  try {
    await deleteDoc(doc(db, "usuarios", id));
    alert(`Usuário "${nome}" excluído com sucesso!`);
  } catch (error) {
    console.error("Erro ao deletar:", error);
    alert("Erro ao excluir documento do banco.");
  }
}