const socket = io();
let nickname = '';

const sendButton = document.querySelector('.send-button');
sendButton.addEventListener('click', () => {
  // console.log('clicou aqui');
  const messageBox = document.querySelector('.message-box');
  const chatMessage = messageBox.value;
  const message = {
    chatMessage,
    nickname, // implementar random aqui
  };
  socket.emit('message', message);
  messageBox.value = '';
});

socket.on('nickname', (randomNickname) => {
  nickname = randomNickname;
});

socket.on('message', (message) => {
  console.log('mensagem chegou no cliente: ', message);
  const chatBoard = document.querySelector('.chat-section');
  const paragraph = document.createElement('p');
  paragraph.setAttribute('data-testid', 'message');
  paragraph.innerHTML = message;
  chatBoard.appendChild(paragraph);
});
