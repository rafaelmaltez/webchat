const socket = window.io();
let nickname = '';
const chatBoard = document.querySelector('.chat-section');
const membersSection = document.querySelector('.active-members-section');
const sendButton = document.querySelector('.send-button');
const messageBox = document.querySelector('.message-box');
const nicknameButton = document.querySelector('.nickname-button');
const nicknameBox = document.querySelector('.nickname-box');

socket.on('nickname', (randomNickname) => {
  nickname = randomNickname;
});

socket.on('message', (message) => {
  console.log('mensagem chegou no cliente: ', message);
  const paragraph = document.createElement('p');
  paragraph.setAttribute('data-testid', 'message');
  paragraph.innerHTML = message;
  chatBoard.appendChild(paragraph);
});

socket.on('members', (activeMembers) => {
  membersSection.innerHTML = '';
  activeMembers.forEach((member) => {
    const li = document.createElement('li');
    li.setAttribute('data-testid', 'online-user');
    li.innerHTML = member.nickname;
    membersSection.appendChild(li);
  });
});

sendButton.addEventListener('click', () => {
  const chatMessage = messageBox.value;
  const message = {
    chatMessage,
    nickname,
  };
  socket.emit('message', message);
  messageBox.value = '';
});

nicknameButton.addEventListener('click', () => {
  const newNickname = nicknameBox.value;
  socket.emit('updateNickname', newNickname);
});