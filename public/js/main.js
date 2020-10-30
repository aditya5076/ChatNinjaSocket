const chatForm = document.getElementById('chat-form');
const chatMessage = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const usersList = document.getElementById('users');

const socket = io();

// to get the url from Qs=>for eg=>username=aditya&room=JavaScript
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

// output room and users info
socket.on('roomUsers', ({ room, users }) => {
  outputRoomInfo(room);
  outputUsersInfo(users);
});

// to join chatroom with username and room
socket.emit('joinRoom', { username, room });

// to get the message from the server
socket.on('message', (message) => {
  console.log(message);
  outputmessage(message);

  // to always scrolldown
  chatMessage.scrollTop = chatMessage.scrollHeight;
});

// message in dialog box submission
chatForm.addEventListener('submit', (e) => {
  e.preventDefault();

  // to get msg from input field
  const msg = e.target.elements.msg.value;

  // emit message on server
  socket.emit('chatMessage', msg);

  // clear the inputs
  e.target.elements.msg.value = '';
  e.target.elements.msg.focus();
});

// to create the msg dialog box whenever user send text
function outputmessage(message) {
  const div = document.createElement('div');
  div.classList.add('message');
  div.innerHTML = ` <p class="meta">${message.username} <span>${message.time}</span></p>
          <p class="text">${message.text}</p>`;
  document.querySelector('.chat-messages').appendChild(div);
}

// func to output room info in DOM
function outputRoomInfo(room) {
  roomName.innerText = room;
}

// func to output users info in DOM
function outputUsersInfo(users) {
  usersList.innerHTML = `${users
    .map((user) => `<li>${user.username}</li>`)
    .join('')}`;
}
