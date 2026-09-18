const listaDeJogos = [
  { id: 1, nome: "Cobrinha", img: "./cobrinha.jpg", url: "./jogos/cobrinha.html" },
  { id: 2, nome: "Jogo da Memória", img: "./ursinho.png", url: "./jogos/memoria.html" },
  { id: 3, nome: "Flappy Bird", img: "./passarim.jpg", url: "./jogos/flappy.html" },
  { id: 4, nome: "Jogo da Velha", img: "./jogodaveia.jpg", url: "./jogos/velha.html" }
];
let indiceAtual = 0, jogosExibidos = listaDeJogos;
const body=document.body, inputBusca=document.getElementById('input-busca-jogos');
const checkboxTema=document.getElementById('config-theme');
const modalConfig=document.getElementById('modal-config'), modalTermos=document.getElementById('modal-termos');
const profileMenu=document.getElementById('profile-menu'), dropdownMenu=document.getElementById('dropdown-menu');
const applyTheme=()=>{const light=localStorage.getItem('theme')==='light';body.classList.toggle('light-theme',light);if(checkboxTema)checkboxTema.checked=!light};
checkboxTema?.addEventListener('change',e=>{localStorage.setItem('theme',e.target.checked?'dark':'light');applyTheme()}); applyTheme();
function atualizarCarrossel(jogos=listaDeJogos){ jogosExibidos=jogos; if(!jogos.length){document.getElementById('game-title').textContent='Nenhum jogo encontrado';return} indiceAtual=(indiceAtual+jogos.length)%jogos.length; const a=jogos[indiceAtual],p=jogos[(indiceAtual-1+jogos.length)%jogos.length],n=jogos[(indiceAtual+1)%jogos.length]; document.getElementById('game-title').textContent=a.nome; document.getElementById('game-image').src=a.img; document.getElementById('img-prev').src=p.img; document.getElementById('img-next').src=n.img; document.getElementById('btn-play-current').onclick=()=>location.href=a.url;}
inputBusca?.addEventListener('input',e=>{const t=e.target.value.toLowerCase().trim();indiceAtual=0;atualizarCarrossel(listaDeJogos.filter(j=>j.nome.toLowerCase().includes(t)))});
document.getElementById('prev-btn')?.addEventListener('click',()=>{indiceAtual=(indiceAtual-1+jogosExibidos.length)%jogosExibidos.length;atualizarCarrossel(jogosExibidos)});
document.getElementById('next-btn')?.addEventListener('click',()=>{indiceAtual=(indiceAtual+1)%jogosExibidos.length;atualizarCarrossel(jogosExibidos)});
document.getElementById('btn-profile')?.addEventListener('click',e=>{e.stopPropagation();profileMenu?.classList.toggle('hidden');dropdownMenu?.classList.add('hidden')});
document.getElementById('btn-menu-options')?.addEventListener('click',e=>{e.stopPropagation();dropdownMenu?.classList.toggle('hidden');profileMenu?.classList.add('hidden')});
document.addEventListener('click',()=>{profileMenu?.classList.add('hidden');dropdownMenu?.classList.add('hidden')});
document.getElementById('btn-config')?.addEventListener('click',e=>{e.preventDefault();modalConfig?.classList.remove('hidden');dropdownMenu?.classList.add('hidden')});
document.getElementById('close-config')?.addEventListener('click',()=>modalConfig?.classList.add('hidden'));
document.getElementById('menu-link-termos')?.addEventListener('click',e=>{e.preventDefault();modalTermos?.classList.remove('hidden');dropdownMenu?.classList.add('hidden')});
document.getElementById('close-termos')?.addEventListener('click',()=>modalTermos?.classList.add('hidden'));
[modalConfig,modalTermos].forEach(m=>m?.addEventListener('click',e=>{if(e.target===m)m.classList.add('hidden')}));
document.getElementById('btn-save-nickname')?.addEventListener('click',()=>{const n=document.getElementById('config-nickname').value.trim();if(n){localStorage.setItem('nickname',n);document.getElementById('user-nickname').textContent=n;document.getElementById('config-nickname').value='';alert('Nickname atualizado!')}});
atualizarCarrossel();
