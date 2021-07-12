const randomstring = require('randomstring');
const moment = require('moment');

moment.locale('pt-br');
const MessageModel = require('../models/messageModel');

let activeMembers = [];

const setNickName = (newNickname, socket, io) => {
  activeMembers = activeMembers.map((member) => {
    if (member.id === socket.id) { return { id: socket.id, nickname: newNickname }; }
    return member;
  });
  io.emit('members', activeMembers);
};

const addRandomNickName = (socket) => {
  const randomNickName = randomstring.generate({ length: 16, charset: 'alphabetic' });
  activeMembers.push({ id: socket.id, nickname: randomNickName });
  socket.emit('nickname', randomNickName);
};

const formatMessage = (message) => {
  const date = moment().format('L').replace(/\//g, '-');
  const time = moment().format('LTS');
  const formattedMessage = `${date} ${time} ${message.nickname} ${message.chatMessage}`;
  const dbMessage = {
  message: message.chatMessage,
  nickname: message.nickname,
  timestamps: `${date} ${time}`,
  };
  return { formattedMessage, dbMessage };
};

const sendMessage = async (message, io) => {
  const { formattedMessage, dbMessage } = formatMessage(message);
  io.emit('message', formattedMessage);
  await MessageModel.create(dbMessage);
};

const disconnect = (socket, io) => {
  activeMembers = activeMembers
    .filter((member) => member.id !== socket.id);
  io.emit('members', activeMembers);
};

module.exports = (io) => {
io.on('connection', (socket) => {
  addRandomNickName(socket);
  io.emit('members', activeMembers);
  socket.on('message', (message) => sendMessage(message, io));
  socket.on('updateNickname', (nickname) => setNickName(nickname, socket, io));
  socket.on('disconnect', () => disconnect(socket, io));
});
};