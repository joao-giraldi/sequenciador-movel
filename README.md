# 📡 Trabalho Prático – Sistemas Distribuídos (Grupo 2)

**Tema:** Sequenciador Móvel  
**Disciplina:** Sistemas Distribuídos – UFSC Araranguá – 2025.1  
**Integrante:** João Marcos Moço, Gabriel Juliani e Nicolas Sanson
---

## 🧠 Descrição da Proposta

Este projeto implementa um sistema cliente-servidor com um **sequenciador móvel**, responsável por garantir a ordenação de mensagens trocadas entre os clientes conectados. Diferente de um sequenciador fixo, o papel de sequenciador pode ser transferido dinamicamente entre os participantes.

A aplicação também possui uma **interface web interativa**, que exibe em tempo real:
- Mensagens enviadas e recebidas;
- Ordem das mensagens;
- Quem é o sequenciador atual;
- Um console de eventos em tempo real para depuração.

---

## 🛠️ Tecnologias Utilizadas

| Tecnologia   | Descrição                                 |
|--------------|---------------------------------------------|
| Node.js      | Runtime JavaScript para o servidor          |
| TypeScript   | Superset de JS com tipagem estática         |
| Express      | Framework web para servir arquivos estáticos|
| Socket.io    | Comunicação em tempo real via WebSockets    |
| HTML/CSS/JS  | Interface web do cliente                    |

---

## 🚀 Como Executar

### 1. Instalar as dependências

```bash
npm install
```

### 2. Iniciar o servidor (modo desenvolvimento)

```bash
npm run dev
```

O servidor será iniciado em: [http://localhost:3000](http://localhost:3000)

### 3. Acessar via navegador

Abra múltiplas abas ou janelas para simular vários clientes.  
Cada cliente poderá:
- Enviar mensagens;
- Tornar-se o sequenciador;
- Visualizar em tempo real a comunicação e eventos.

---

## 🔁 Lógica de Funcionamento

- O **primeiro cliente conectado** se torna o sequenciador.
- O sequenciador **atribui IDs sequenciais** a cada mensagem enviada.
- **Qualquer cliente pode solicitar ser o novo sequenciador** (botão).
- Se o sequenciador se desconectar, o servidor promove automaticamente outro cliente.
- Todos os eventos (mensagens, mudanças de sequenciador, conexões) são **logados visualmente** no console da interface.

---

## 📸 Interface

A interface web exibe:
- 📨 Mensagens com ID, remetente e conteúdo;
- 👑 Sequenciador atual;
- 🖥️ Console visual com logs de sistema (`console.log`) visíveis para o usuário.

---

## 📦 Dependências

### Dependências principais:

- `express`
- `socket.io`

### Dependências de desenvolvimento:

- `typescript`
- `ts-node-dev`
- `@types/node`
- `@types/express`

Instaladas via:

```bash
npm install express socket.io
npm install -D typescript ts-node-dev @types/node @types/express
```

---


