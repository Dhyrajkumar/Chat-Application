// let sock = io();
const socket = io('http://localhost:8000');

const form = document.getElementById('send-container');
const messageInput = document.getElementById('messageInp');
const messageContainer = document.querySelector('.container');
var audio = new Audio('Message_Tone.mp3');

const append = (message, position) => {
  const messageElement = document.createElement('div');
  messageElement.innerText = message;
  messageElement.classList.add('message');
  messageElement.classList.add(position);
  messageContainer.append(messageElement);
  if (position == 'left') {
    audio.play();
  }
};

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const message = messageInput.value;
  append(`You: ${message}`, 'right'); // Use backticks for template literals
  socket.emit('send', message);
  messageInput.value = '';
});

const name = prompt('Enter your name to join');
socket.emit('new-user-joined', name);

socket.on('user-joined', name => {
  append(`${name} joined the chat`, 'right'); // Use backticks for template literals
});

socket.on('receive', (data) => {
  append(`${data.name}: ${data.message}`, 'left'); // Use backticks for template literals
});

socket.on('left', name => {
  append(`${name} left the chat`, 'right'); // Use backticks for template literals
});
