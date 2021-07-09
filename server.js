const express = require('express');
const randomstring = require('randomstring');
const moment = require('moment');

const app = express();
const http = require('http').createServer(app);
const cors = require('cors');

const io = require('socket.io')(http, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

io.on('connection', (socket) => {
  const randomNickName = randomstring.generate(16);
  socket.emit('nickname', randomNickName);
  socket.on('message', (message) => {
    const date = moment();
    const DDMMYYY = `${date.date()}/${date.month()}/${date.year()}`;
    const HHMMSS = `${date.hour()}:${date.minutes()}:${date.seconds()}`;
    const formattedMessage = `${DDMMYYY} ${HHMMSS} ${message.nickname} ${message.chatMessage}`;
    io.emit('message', formattedMessage);
  });
});

app.use(cors());
app.engine('html', require('ejs').renderFile);

app.set('view engine', 'html');
app.set('views', './views');
app.use(express.static(`${__dirname}/public`));

app.get('/', (_req, res) => {
  res.render('index.html');
});

const PORT = 3000;
http.listen(PORT, () => { console.log(`Ouvindo na porta ${PORT}`); });