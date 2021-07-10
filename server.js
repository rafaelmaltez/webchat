const express = require('express');
const randomstring = require('randomstring');
const moment = require('moment');

moment.locale('pt-br');

const app = express();
const http = require('http').createServer(app);
const cors = require('cors');

const io = require('socket.io')(http, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});
const MessageModel = require('./models/messageModel');

let activeMembers = [];

const getMessage = async (message) => {
  const date = moment().format('L').replace(/\//g, '-');
  const time = moment().format('LTS');
  const formattedMessage = `${date} ${time} ${message.nickname} ${message.chatMessage}`;
  const dbMessage = {
    message: message.chatMessage,
    nickname: message.nickname,
    timestamps: `${date} ${time}`,
  };
  io.emit('message', formattedMessage);
  await MessageModel.create(dbMessage);
};

io.on('connection', (socket) => {
  console.log('conectou')
  const randomNickName = randomstring.generate({ length: 16, charset: 'alphabetic' });
  activeMembers.push({ id: socket.id, nickname: randomNickName });
  socket.emit('nickname', randomNickName);
  io.emit('members', activeMembers);
  socket.on('message', getMessage);
  socket.on('updateNickname', (newNickname) => {
    activeMembers = activeMembers.map((member) => {
      if (member.id === socket.id) { return { id: socket.id, nickname: newNickname }; }
      return member;
    });
    io.emit('members', activeMembers);
  });
  socket.on('disconnect', () => {
    activeMembers = activeMembers
    .filter((member) => member.id !== socket.id);
    io.emit('members', activeMembers);
  });
});

app.use(cors());
app.engine('html', require('ejs').renderFile);

app.set('view engine', 'html');
app.set('views', './public');
app.use(express.static(`${__dirname}/public`));

app.get('/', async (_req, res) => {
  const messages = await MessageModel.getAll();
  res.render('pages/index', { messages });
});

const PORT = 3000;
http.listen(PORT, () => { console.log(`Ouvindo na porta ${PORT}`); });