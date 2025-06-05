const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');

const app = express();

app.get('/', (req, res) => {
  res.send("Editor server is running");
});

const server = http.createServer(app);

let currentText = "";

const io = new Server(server, {
  cors: {
    origin: "https://text-editor-bay-zeta.vercel.app",
    methods: ["GET", "POST"]
  }
});

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.emit('init', currentText);

  socket.broadcast.emit('user-joined', { userId: socket.id });

  socket.on('cursor-moved', (msg) => {
    console.log(msg);

    if (msg.operation === "add") {
      currentText = currentText.slice(0, msg.cursor) + msg.text + currentText.slice(msg.cursor);
    } else if (msg.operation === "delete") {
      currentText = currentText.slice(0, msg.cursor) + currentText.slice(msg.cursor + msg.text.length);
    }

    socket.broadcast.emit('cursor-moved', msg);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    socket.broadcast.emit('user-left', { userId: socket.id });
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
