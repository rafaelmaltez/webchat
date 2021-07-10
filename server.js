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

let activeMembers = [];

const getMessage = (message) => {
  const date = moment().format('L').replace(/\//g, '-');
  const time = moment().format('LTS');
  const formattedMessage = `${date} ${time} ${message.nickname} ${message.chatMessage}`;
  io.emit('message', formattedMessage);
};

io.on('connection', (socket) => {
  const randomNickName = randomstring.generate(16);
  activeMembers.push({ id: socket.id, nickname: randomNickName });
  socket.emit('nickname', randomNickName);
  io.emit('members', activeMembers);
  socket.on('message', getMessage);
  socket.on('updateNickname', (newNickname) => {
    console.log('updated nickname server');
    activeMembers = activeMembers.map((member) => {
      if (member.id === socket.id) { return { id: socket.id, nickname: newNickname }; }
      return member;
    });
    io.emit('members', activeMembers);
  });
});

app.use(cors());
app.engine('html', require('ejs').renderFile);

app.set('view engine', 'html');
app.set('views', './public');
app.use(express.static(`${__dirname}/public`));

app.get('/', (_req, res) => {
  res.render('pages/index', { activeMembers });
});

const PORT = 3000;
http.listen(PORT, () => { console.log(`Ouvindo na porta ${PORT}`); });