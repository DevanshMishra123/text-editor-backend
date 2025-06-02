const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');

const app = express();
app.use(cors({
  origin: '*',  
  methods: ['GET', 'POST'],        
}))
const server = http.createServer(app);
const io = new Server(server); 

app.get('/', (req, res) => {
  res.send("Editor server is running")
});

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('cursor-moved', (msg) => {
    console.log(msg);
    socket.broadcast.emit('cursor-moved', msg); 
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

server.listen(5000, () => {
  console.log('Server listening on http://localhost:5000');
});
