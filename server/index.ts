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


let sequenciadorId: string | null = null;
let messageCounter = 1;

// evento disparado quando um novo cliente se conecta, cada socket representa um cliente único
io.on("connection", (socket) => {
  console.log(`Cliente conectado: ${socket.id}`);

  // Se for o primeiro, vira sequenciador
  if (!sequenciadorId) {
    sequenciadorId = socket.id;
    io.emit("sequenciador_atual", sequenciadorId);
  } else {
    // Notifica apenas o novo cliente quem é o sequenciador atual
    socket.emit("sequenciador_atual", sequenciadorId);
  }

  // recebe uma mensagem e atribui ordem, formata a mensagem para, no final, enviar com o ID sequencial, quem enviou, o texto e quem era o sequenciador no momento
  socket.on("mensagem", (msg: string) => {
    const idMensagem = messageCounter++;
    const mensagemFinal = {
      id: idMensagem,
      de: socket.id,
      texto: msg,
      sequenciador: sequenciadorId
    };

    io.emit("mensagem_enviada", mensagemFinal);
  });

  // permite que qualquer cliente se torne o novo sequenciador, todos os clientes são notificados
  socket.on("tornar_sequenciador", () => {
    sequenciadorId = socket.id;
    io.emit("sequenciador_atual", sequenciadorId);
  });

  // exibe no terminal que se desconectou, se quem saiu era o sequenciador o próximo cliente conectado se torna o novo sequenciador
  socket.on("disconnect", () => {
    console.log(`Cliente desconectado: ${socket.id}`);
    if (socket.id === sequenciadorId) {
      const restantes = Array.from(io.sockets.sockets.keys());
      sequenciadorId = restantes[0] || null;
      io.emit("sequenciador_atual", sequenciadorId);
    }
  });
});

server.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
