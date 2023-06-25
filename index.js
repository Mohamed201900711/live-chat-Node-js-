var express = require('express');

var application = express();
var server = application.listen(3000, function() {
  console.log('Your Server Is running at http:/localhost:3000');
});

application.use('/', express.static('public_html'));
// application.get('/', function(req, res) {
//   res.sendFile(__dirname + '/index.html');
// });
const io = require('socket.io')(server)

const users = {}

io.on('connection', socket => {
  socket.on('new-user', name => {
    users[socket.id] = name
    socket.broadcast.emit('user-connected', name)
  })
  socket.on('send-chat-message', message => {
    socket.broadcast.emit('chat-message', { message: message, name: users[socket.id] })
  })
  socket.on('disconnect', () => {
    socket.broadcast.emit('user-disconnected', users[socket.id])
    delete users[socket.id]
  })
})