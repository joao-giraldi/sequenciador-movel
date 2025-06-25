interceptConsole();
const socket = io({ query: { tipo: "emissor" } });
const input = document.getElementById("inputMensagem");
const consoleDiv = document.getElementById("consoleLog");



socket.on("connect", () => {
  console.log(`🟢 Emissor conectado: ${socket.id}`);
});

function enviarMensagem() {
  const texto = input.value.trim();
  if (texto) {
    console.log(`📤 Enviando mensagem: "${texto}"`);
    socket.emit("mensagem_emissor", texto);
    input.value = "";
  }
}

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
