const palavras = [
  "amora", "beijo", "caixa", "calor", "canto",
  "carro", "casas", "chave", "chuva", "festa",
  "livro", "pasta", "porta", "tigre", "verde",
  "vento", "vidro", "patos", "ricos", "bicho",
  "manga", "navio", "nuvem", "papel", "praia"
];

const MAX_TENTATIVAS = 6;
const TAMANHO = 5;

let palavraSecreta = "";
let tentativaAtual = 0;
let acabou = false;

const grid = document.getElementById("grid");
const input = document.getElementById("palpite");
const btnTentar = document.getElementById("btnTentar");
const btnReiniciar = document.getElementById("btnReiniciar");
const mensagem = document.getElementById("mensagem");

function sortearPalavra() {
  const i = Math.floor(Math.random() * palavras.length);
  return palavras[i];
}

function montarGrid() {
  grid.innerHTML = "";
  for (let l = 0; l < MAX_TENTATIVAS; l++) {
    const linha = document.createElement("div");
    linha.className = "linha";
    for (let c = 0; c < TAMANHO; c++) {
      const celula = document.createElement("div");
      celula.className = "celula";
      linha.appendChild(celula);
    }
    grid.appendChild(linha);
  }
}

function compararPalpite(palpite) {
  const resultado = Array(TAMANHO).fill("errada");
  const contadorLetras = {};

  for (let i = 0; i < TAMANHO; i++) {
    if (palpite[i] === palavraSecreta[i]) {
      resultado[i] = "certa";
    } else {
      const letra = palavraSecreta[i];
      contadorLetras[letra] = (contadorLetras[letra] || 0) + 1;
    }
  }

  for (let i = 0; i < TAMANHO; i++) {
    if (resultado[i] === "certa") continue;
    const letra = palpite[i];
    if (contadorLetras[letra] && contadorLetras[letra] > 0) {
      resultado[i] = "lugar-errado";
      contadorLetras[letra]--;
    }
  }

  return resultado;
}

function pintarLinha(linha, palpite, resultado) {
  for (let i = 0; i < TAMANHO; i++) {
    const celula = linha.children[i];
    celula.textContent = palpite[i].toUpperCase();
    celula.classList.add(resultado[i]);
  }
}

function tentar() {
  if (acabou) return;

  const palpite = input.value.toLowerCase().trim();

  if (palpite.length !== TAMANHO) {
    mensagem.textContent = "o palpite precisa ter 5 letras!";
    mensagem.className = "";
    input.focus();
    return;
  }

  const linha = grid.children[tentativaAtual];
  const resultado = compararPalpite(palpite);
  pintarLinha(linha, palpite, resultado);

  tentativaAtual++;
  input.value = "";

  if (palpite === palavraSecreta) {
    mensagem.textContent = `Boa! Acertou em ${tentativaAtual} tentativa(s) 🎉`;
    mensagem.className = "venceu";
    acabou = true;
    btnReiniciar.classList.remove("escondido");
    input.disabled = true;
    btnTentar.disabled = true;
    return;
  }

  if (tentativaAtual >= MAX_TENTATIVAS) {
    mensagem.textContent = `ih... a palavra era "${palavraSecreta.toUpperCase()}" 😢`;
    mensagem.className = "perdeu";
    acabou = true;
    btnReiniciar.classList.remove("escondido");
    input.disabled = true;
    btnTentar.disabled = true;
    return;
  }

  mensagem.textContent = `tentativas restantes: ${MAX_TENTATIVAS - tentativaAtual}`;
  mensagem.className = "";
  input.focus();
}

function reiniciar() {
  palavraSecreta = sortearPalavra();
  tentativaAtual = 0;
  acabou = false;
  input.disabled = false;
  btnTentar.disabled = false;
  input.value = "";
  mensagem.textContent = "";
  mensagem.className = "";
  btnReiniciar.classList.add("escondido");
  montarGrid();
  input.focus();
  console.log("novo jogo iniciado");
}

function iniciar() {
  palavraSecreta = sortearPalavra();
  tentativaAtual = 0;
  acabou = false;
  montarGrid();
  btnTentar.addEventListener("click", tentar);
  btnReiniciar.addEventListener("click", reiniciar);
  input.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
      tentar();
    }
  });
  input.focus();
}

iniciar();
