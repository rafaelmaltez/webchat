const socket = io();

const sendButton = document.querySelector('.send-button');
sendButton.addEventListener('click', () => {
  // console.log('clicou aqui');
  const messageBox = document.querySelector('.message-box');
  const chatMessage = messageBox.value;
  const message = {
    chatMessage,
    nickname: 'rafael', // implementar random aqui
  };
  socket.emit('message', message);
  messageBox.value = '';
});

socket.on('message', (message) => {
  console.log('mensagem chegou no cliente: ', message);
  const chatBoard = document.querySelector('.chat-section');
  const paragraph = document.createElement('p');
  paragraph.setAttribute('data-testid', 'message');
  paragraph.innerHTML = message;
  chatBoard.appendChild(paragraph);
});
