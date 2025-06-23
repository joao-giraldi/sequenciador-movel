const socket = io({ query: { tipo: "sequenciador" } });
const mensagensDiv = document.getElementById("mensagens");
const sequenciadorAtual = document.getElementById("sequenciadorAtual");
const btnTrocar = document.getElementById("trocarSequenciador");

socket.on("connect", () => {
  console.log(`🟢 Sequenciador conectado: ${socket.id}`);
});

socket.on("sequenciador_atual", (id) => {
  sequenciadorAtual.innerHTML = `Sequenciador atual: ${id === socket.id ? "Você" : id}`;
  console.log(`👑 Sequenciador atual: ${id === socket.id ? "Você" : id}`);
});

socket.on("mensagem_para_sequenciador", (msg) => {
  console.log(`📥 Recebida de ${msg.de}: "${msg.texto}"`);

  socket.emit("mensagem_ordenada", {
    de: msg.de,
    texto: msg.texto
  });

  console.log("📤 Reenviada com ordem pelo sequenciador");
});

socket.on("mensagem_reordenada", (msg) => {
  const div = document.createElement("div");
  div.textContent = `[${msg.id}] ${msg.de} ➜ "${msg.texto}"`;
  mensagensDiv.appendChild(div);
  mensagensDiv.scrollTop = mensagensDiv.scrollHeight;
});

btnTrocar.addEventListener("click", () => {
  console.log("🔁 Solicitando troca de sequenciador...");
  socket.emit("trocar_sequenciador");
});

function interceptConsole(divId = "consoleLog") {
  const originalLog = console.log;
  const consoleDiv = document.getElementById(divId);

  console.log = function (...args) {
    const msg = args.map(a => typeof a === "object" ? JSON.stringify(a) : String(a)).join(" ");
    const line = document.createElement("div");
    line.textContent = msg;
    consoleDiv.appendChild(line);
    consoleDiv.scrollTop = consoleDiv.scrollHeight;
    originalLog.apply(console, args);
  };
}

interceptConsole();