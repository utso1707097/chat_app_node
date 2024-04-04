const express = require("express");
const socketio = require("socket.io");
const http = require("http");
const cors = require('cors');
const { addUser, removeUser, getUser, getUsersInRoom } = require('./users.js');

const PORT = process.env.PORT || 5000;
const router = require("./router");

const app = express();
const server = http.createServer(app);
app.use(cors());
const io = socketio(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

app.use(router);

io.on('connect', (socket) => {
  socket.on('join', ({ name, room }, callback) => {
    const { error, user } = addUser({ id: socket.id, name, room });

    if (error) return callback(error);

    socket.join(user.room);

    socket.emit('message', { user: 'admin', text: `${user.name}, welcome to room ${user.room}.` });
    socket.broadcast.to(user.room).emit('message', { user: 'admin', text: `${user.name} has joined!` });

    io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room) });

    callback();
  });

  // socket.on('sendFile', ({ fileName, base64data }) => {
  //   const user = getUser(socket.id);

  //   io.to(user.room).emit('file', { user: user.name, fileName, base64data });
  // });

  // socket.on('fileUploaded', ({ fileName, base64data }) => {
  //   const user = getUser(socket.id);

  //   io.to(user.room).emit('file', { user: user.name, fileName, base64data });
  // });

  socket.on('sendMessage', (data, callback) => {
    // Handle sending message and file logic
    const user = getUser(socket.id);
    io.to(user.room).emit('message', { user: user.name, text: data.message });

    if (data.file) {
        // Assuming you have some file handling logic here
        // You can access the file data from `data.file`
        console.log(data.file);
        io.to(user.room).emit('file', { user: user.name, fileName: 'YourFileNameHere', base64data: data.file });
    }

    callback();
});


  socket.on('disconnect', () => {
    const user = removeUser(socket.id);

    if (user) {
      io.to(user.room).emit('message', { user: 'Admin', text: `${user.name} has left.` });
      io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room) });
    }
  });
});

server.listen(PORT, () => console.log(`Server has started on port ${PORT}`));
