// Utilitário para log visual separado por papel
function logPara(papel, texto) {
  const ids = {
    emissor1: "consoleEmissor1",
    emissor2: "consoleEmissor2",
    sequenciador1: "consoleSequenciador1",
    sequenciador2: "consoleSequenciador2",
    sequenciador3: "consoleSequenciador3",
    receptor: "consoleReceptor",
  };
  const el = document.getElementById(ids[papel]);
  if (!el) return;
  const linha = document.createElement("div");
  linha.textContent = texto;
  el.appendChild(linha);
  el.scrollTop = el.scrollHeight;
}

// 🟢 Conexão como emissor
const emissor1Socket = io({ query: { tipo: "emissor" } });
emissor1Socket.on("connect", () => {
  logPara("emissor1", `🟢 Emissor 1 conectado: ${emissor1Socket.id}`);
});
document.getElementById("btnEnviar1").addEventListener("click", () => {
  const texto = document.getElementById("inputMensagem1").value.trim();
  if (texto) {
    logPara("emissor1", `📤 Enviando: "${texto}"`);
    emissor1Socket.emit("mensagem_emissor", texto);
    document.getElementById("inputMensagem1").value = "";
  }
});

const emissor2Socket = io({ query: { tipo: "emissor" } });
emissor2Socket.on("connect", () => {
  logPara("emissor2", `🟢 Emissor 2 conectado: ${emissor2Socket.id}`);
});
document.getElementById("btnEnviar2").addEventListener("click", () => {
  const texto = document.getElementById("inputMensagem2").value.trim();
  if (texto) {
    logPara("emissor2", `📤 Enviando: "${texto}"`);
    emissor2Socket.emit("mensagem_emissor", texto);
    document.getElementById("inputMensagem2").value = "";
  }
});

// 🔵 Sequenciadores (3)
const sequenciadores = [1, 2, 3].map((num) => {
  const socket = io({ query: { tipo: "sequenciador" } });

  socket.on("connect", () => {
    logPara(
      `sequenciador${num}`,
      `🔵 Conectado como Sequenciador ${num}: ${socket.id}`
    );
  });

  socket.on("sequenciador_atual", (idAtual) => {
    const campo = document.getElementById(`sequenciadorAtual${num}`);
    campo.textContent = `Sequenciador atual: ${
      idAtual === socket.id ? "Você" : idAtual
    }`;
    logPara(
      `sequenciador${num}`,
      `👑 Sequenciador atual: ${idAtual === socket.id ? "Você" : idAtual}`
    );
  });

  socket.on("mensagem_para_sequenciador", (msg) => {
    logPara(`sequenciador${num}`, `📥 Recebido de ${msg.de}: "${msg.texto}"`);
    socket.emit("mensagem_ordenada", msg);
    logPara(`sequenciador${num}`, "📤 Reenviado com ordem.");
  });

  socket.on("mensagem_reordenada", (msg) => {
    const texto = `[${msg.id}] ${msg.de} ➜ "${msg.texto}"`;
    const div = document.createElement("div");
    div.textContent = texto;
    document.getElementById(`mensagensSequenciador${num}`).appendChild(div);
  });

  return socket;
});

// 🔁 Botões de troca de sequenciador
document.querySelectorAll(".btnTrocar").forEach((btn) => {
  btn.addEventListener("click", () => {
    const id = Number(btn.dataset.id);
    logPara(`sequenciador${id}`, "🔁 Solicitando troca de sequenciador...");
    sequenciadores[id - 1].emit("trocar_sequenciador");
  });
});

// 🟣 Conexão como receptor
const receptorSocket = io({ query: { tipo: "receptor" } });

receptorSocket.on("connect", () => {
  logPara("receptor", `🟣 Receptor conectado: ${receptorSocket.id}`);
});

receptorSocket.on("mensagem_reordenada", (msg) => {
  const texto = `[${msg.id}] ${msg.de} ➜ "${msg.texto}"`;
  logPara("receptor", `📩 ${texto}`);

  const div = document.createElement("div");
  div.textContent = texto;
  document.getElementById("mensagensReceptor").appendChild(div);
});
