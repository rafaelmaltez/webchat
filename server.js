const express = require('express');
// const randomstring = require('randomstring');
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

require('./sockets/index')(io);

app.use(cors());
app.engine('html', require('ejs').renderFile);

app.set('view engine', 'html');
app.set('views', './public/pages');
app.use(express.static(`${__dirname}/public`));

app.get('/', async (_req, res) => {
  const messages = await MessageModel.getAll();
  res.render('index', { messages });
});

const PORT = 3000;
http.listen(PORT, () => { console.log(`Ouvindo na porta ${PORT}`); });