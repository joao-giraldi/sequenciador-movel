// Código principal do servidor — gerencia conexões, mensagens e o sequenciador.
import express from "express";
import http from "http";
import { Server } from "socket.io";
import path from "path";

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = 3000;

// Serve os arquivos estáticos do client (index.html e script.js)
app.use(express.static(path.join(__dirname, "../client")));

app.get("/emissor", (_, res) => {
  res.sendFile(path.join(__dirname, "../client/emissor.html"));
});

app.get("/sequenciador", (_, res) => {
  res.sendFile(path.join(__dirname, "../client/sequenciador.html"));
});

app.get("/receptor", (_, res) => {
  res.sendFile(path.join(__dirname, "../client/receptor.html"));
});

let sequenciadorId: string | null = null;
let messageCounter = 1;

const grupoSequenciador = new Set<string>();

// evento disparado quando um novo cliente se conecta, cada socket representa um cliente único
io.on("connection", (socket) => {
  const tipo = socket.handshake.query.tipo; // ex: emissor, sequenciador, receptor
  console.log(`Cliente conectado: ${socket.id}`);

  if (tipo === "sequenciador") {
    grupoSequenciador.add(socket.id);
  }
  console.log(grupoSequenciador);

  // Se for o primeiro, vira sequenciador
  if (!sequenciadorId && tipo === "sequenciador") {
    sequenciadorId = socket.id;
    io.emit("sequenciador_atual", sequenciadorId);
  } else {
    // Notifica apenas o novo cliente quem é o sequenciador atual
    socket.emit("sequenciador_atual", sequenciadorId);
  }

  // recebe uma mensagem e atribui ordem, formata a mensagem para, no final, enviar com o ID sequencial, quem enviou, o texto e quem era o sequenciador no momento
  socket.on("mensagem_emissor", (msg: string) => {
    console.log(`Mensagem do emissor ${socket.id}: "${msg}"`);

    // Repassa para todos os membros do grupo sequenciador
    if (grupoSequenciador.size === 0) {
      console.log("⚠️ Não há sequenciadores disponiveis");
    } else {
      grupoSequenciador.forEach((id) => {
        io.to(id).emit("mensagem_para_sequenciador", {
          de: socket.id,
          texto: msg,
        });
      });
    }
  });

  socket.on("mensagem_ordenada", (msg: { de: string; texto: string }) => {
    if (socket.id !== sequenciadorId) {
      return;
    }

    const idMensagem = messageCounter++;
    const mensagemFinal = {
      id: idMensagem,
      de: msg.de,
      texto: msg.texto,
      sequenciador: socket.id,
    };

    console.log(
      `✅ Sequenciador ${socket.id} enviou mensagem ordenada #${idMensagem}`
    );
    io.emit("mensagem_reordenada", mensagemFinal);
  });

  // troca o sequenciador atual
  socket.on("trocar_sequenciador", () => {
    trocarSequenciador();
  });

  // exibe no terminal que se desconectou, se quem saiu era o sequenciador o próximo sequenciador conectado se torna o novo
  socket.on("disconnect", () => {
    console.log(`Cliente desconectado: ${socket.id}`);
    if (socket.id === sequenciadorId) {
      grupoSequenciador.delete(socket.id);
      trocarSequenciador();
    }
  });
});

server.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});

function trocarSequenciador() {
  const ids = Array.from(grupoSequenciador);
  if (ids.length == 0) {
    sequenciadorId = null;
    io.emit("sequenciador_atual", sequenciadorId);
    return;
  }
  if (!sequenciadorId) {
    sequenciadorId = ids[0];
  } else {
    const idx = ids.indexOf(sequenciadorId);
    const proximoIdx = (idx + 1) % ids.length;
    sequenciadorId = ids[proximoIdx];
  }
  io.emit("sequenciador_atual", sequenciadorId);
}
