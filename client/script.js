const socket = io();
const mensagensDiv = document.getElementById("mensagens");
const sequenciadorAtual = document.getElementById("sequenciadorAtual");
const consoleDiv = document.getElementById("consoleLog");

// Intercepta e exibe todos os console.log() na tela
(function interceptConsole() {
  const originalLog = console.log;

  console.log = function (...args) {
    const msg = args.map(arg => typeof arg === "object" ? JSON.stringify(arg) : String(arg)).join(" ");
    const line = document.createElement("div");
    line.textContent = msg;
    consoleDiv.appendChild(line);
    consoleDiv.scrollTop = consoleDiv.scrollHeight;

    originalLog.apply(console, args);
  };
})();

// Conexão estabelecida
socket.on("connect", () => {
  console.log(`Conectado como: ${socket.id}`);
});

// Recebe nova mensagem do servidor
socket.on("mensagem_enviada", (msg) => {
  const div = document.createElement("div");
  div.classList.add("msg");
  div.innerHTML = `<strong>[${msg.id}]</strong> ${msg.de === socket.id ? "Você" : msg.de} ➜ "${msg.texto}"`;
  mensagensDiv.appendChild(div);
  mensagensDiv.scrollTop = mensagensDiv.scrollHeight;

  console.log(`Mensagem recebida: { id: ${msg.id}, de: ${msg.de}, texto: "${msg.texto}", sequenciador: ${msg.sequenciador} }`);
});

// Atualiza o ID do sequenciador atual
socket.on("sequenciador_atual", (id) => {
  const isYou = id === socket.id;
  sequenciadorAtual.innerHTML = `Sequenciador atual: <span class="sequenciador">${isYou ? "Você" : id}</span>`;
  console.log(`Novo sequenciador: ${isYou ? "Você" : id}`);
});

// Envia mensagem para o servidor
function enviarMensagem() {
  const input = document.getElementById("inputMensagem");
  const texto = input.value.trim();
  if (texto) {
    console.log(`Enviando mensagem: "${texto}"`);
    socket.emit("mensagem", texto);
    input.value = "";
  }
}

// Pede para se tornar o novo sequenciador
function virarSequenciador() {
  console.log("Solicitando tornar-se o sequenciador...");
  socket.emit("tornar_sequenciador");
}
