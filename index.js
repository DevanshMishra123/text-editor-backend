const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');

const app = express();

app.get('/', (req, res) => {
  res.send("Editor server is running");
});

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "https://text-editor-bay-zeta.vercel.app", 
    methods: ["GET", "POST"]
  }
});

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('cursor-moved', (msg) => {
    console.log(msg);
    socket.broadcast.emit('cursor-moved', msg);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
