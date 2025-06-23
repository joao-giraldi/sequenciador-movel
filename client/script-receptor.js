const socket = io({ query: { tipo: "receptor" } });
const mensagensDiv = document.getElementById("mensagens");
const consoleDiv = document.getElementById("consoleLog");

interceptConsole();

socket.on("connect", () => {
  console.log(`🟢 Receptor conectado: ${socket.id}`);
});

// Exibe mensagens já ordenadas
socket.on("mensagem_reordenada", (msg) => {
  console.log(`📩 Mensagem recebida: [${msg.id}] ${msg.de} ➜ "${msg.texto}"`);

  const div = document.createElement("div");
  div.textContent = `[${msg.id}] ${msg.de} ➜ "${msg.texto}"`;
  mensagensDiv.appendChild(div);
  mensagensDiv.scrollTop = mensagensDiv.scrollHeight;
});

function interceptConsole() {
  const originalLog = console.log;
  console.log = function (...args) {
    const msg = args
      .map((a) => (typeof a === "object" ? JSON.stringify(a) : String(a)))
      .join(" ");
    const line = document.createElement("div");
    line.textContent = msg;
    consoleDiv.appendChild(line);
    consoleDiv.scrollTop = consoleDiv.scrollHeight;
    originalLog.apply(console, args);
  };
}
