const express = require('express');
const http = require('http');
const path = require('path');
const { emit } = require('process');
const socketio = require('socket.io');
const formatMsg = require('./utils/message');
const {
  joinUsers,
  getCurrentUser,
  getUserWhoLeave,
  getRoomUsers,
} = require('./utils/users');

const app = express();
const server = http.createServer(app);
const io = socketio(server);
const botName = 'chatBot';

// to render the public file
app.use(express.static(path.join(__dirname, 'public')));

// runs when client connects
io.on('connection', (socket) => {
  console.log('new connection...');

  socket.on('joinRoom', ({ username, room }) => {
    const user = joinUsers(socket.id, username, room);

    socket.join(user.room);
    // welcome msg
    socket.emit('message', formatMsg(botName, 'Welcome to chatChord...'));

    // info msg to all ither user whenever new signs in
    socket.broadcast
      .to(user.room)
      .emit(
        'message',
        formatMsg(botName, `${user.username} as joined the room`)
      );

    //   send users and room info
    io.to(user.room).emit('roomUsers', {
      room: user.room,
      users: getRoomUsers(user.room),
    });
  });

  //when user sends the msg chatMessage
  socket.on('chatMessage', (msg) => {
    const user = getCurrentUser(socket.id);
    io.to(user.room).emit('message', formatMsg(`${user.username}`, msg)); //to is used for specific actions
  });

  // info to all when user disocnnnect
  socket.on('disconnect', () => {
    const user = getUserWhoLeave(socket.id);
    if (user) {
      io.to(user.room).emit(
        'message',
        formatMsg(botName, ` ${user.username} has left the room`)
      );
      //   send users and room info
      io.to(user.room).emit('roomUsers', {
        room: user.room,
        users: getRoomUsers(user.room),
      });
    }
  });
});

const PORT = 3000 || process.env.PORT;

server.listen(PORT, () => console.log(`server started at port ${PORT}`));
