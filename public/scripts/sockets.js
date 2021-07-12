const socket = window.io();
let nickname = '';
const chatBoard = document.querySelector('.chat-section');
const membersSection = document.querySelector('.active-members-section ul');
const sendButton = document.querySelector('.send-button');
const messageBox = document.querySelector('.message-box');
const nicknameButton = document.querySelector('.nickname-button');
const nicknameBox = document.querySelector('.nickname-box');

const setNickName = (nickName) => { nickname = nickName; };

const renderMessage = (message) => {
  const paragraph = document.createElement('p');
  paragraph.setAttribute('data-testid', 'message');
  paragraph.innerHTML = message;
  chatBoard.appendChild(paragraph);
};

const updateActiveMembers = (activeMembers) => {
  membersSection.innerHTML = '';
  const membersList = [];
  const user = activeMembers.find((usr) => usr.nickname === nickname);
  membersList.push(user);
  const filteredActiveMembers = activeMembers.filter((member) => member.nickname !== nickname);
  filteredActiveMembers.forEach((member) => membersList.push(member));
  membersList.forEach((member) => {
    const li = document.createElement('li');
      li.setAttribute('data-testid', 'online-user');
    li.innerHTML = member.nickname;
    membersSection.appendChild(li);
  });
};

const emitMessage = () => {
  const chatMessage = messageBox.value;
  const message = {
    chatMessage,
    nickname,
  };
  socket.emit('message', message);
  messageBox.value = '';
};

const changeNickname = () => {
  const newNickname = nicknameBox.value;
  nickname = newNickname;
  socket.emit('updateNickname', newNickname);
};

socket.on('nickname', setNickName);

socket.on('message', renderMessage);

socket.on('members', updateActiveMembers);

sendButton.addEventListener('click', emitMessage);

nicknameButton.addEventListener('click', changeNickname);

window.onbeforeunload = (_event) => {
  socket.disconnect();
};