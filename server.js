const express = require('express');

const app = express();
const http = require('http').createServer(app);
const cors = require('cors');
const moment = require('moment');

const io = require('socket.io')(http, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

io.on('connection', (socket) => {
  console.log(`${socket.id} entrou na sala`);
  // socket.user = 'rafael';
  // console.log('user: ', socket.user);
  socket.on('message', (message) => {
    console.log('Objeto de mensagem que chega no back: ', message);
    const date = new Date();
    console.log(date);
    const formattedMessage = `${date} ${message.nickname} ${message.chatMessage}`;
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