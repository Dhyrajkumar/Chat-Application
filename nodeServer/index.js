const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const cors = require('cors'); // Import the cors middleware

const app = express();
const server = http.createServer(app);

app.use(cors()); // Enable CORS for all routes

const io = socketIO(server, {
  cors: {
    origin: 'http://127.0.0.1:5500', // Adjust this to match your client's origin
    methods: ['GET', 'POST'],
  },
});

const users = {};

io.on('connection', (socket) => {
  socket.on('new-user-joined', (name) => {
    console.log("New-user : ", name);
    users[socket.id] = name;
    socket.broadcast.emit('user-joined', name);
  });

  
  socket.on('send', (message) => {
    socket.broadcast.emit('receive', { message: message, name: users[socket.id] });
  });

  socket.on('disconnect', () => {
    socket.broadcast.emit('left', users[socket.id]);
    delete users[socket.id];
  });
});

server.listen(8000, () => {
  console.log('Server is running on port 8000');
});
