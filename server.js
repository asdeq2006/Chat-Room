var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);

users = [];
connections = [];

server.listen(process.env.PORT || 5000);
console.log('Server running...')

io.set('heartbeat timeout', 10000);
io.set('heartbeat interval', 2000);

app.use(express.static('src'));

app.get('/', function(req, res){
	res.sendFile(__dirname +  "/index.html")
});

io.sockets.on('connection', function (socket){
	connections.push(socket);
	console.log('Connected: %s sockets connected', connections.length);

	// Disconnect
	socket.on('disconnect', function(data){
		if(socket.username){
			console.log(socket.username + " disconnected.");
			users.splice(users.indexOf(socket.username), 1);
			updateUsernames(socket.username, 'out');
		}
		connections.splice(connections.indexOf(socket), 1);
		console.log('Disconnected: %s sockets disconnected', connections.length)
	});

	// Send Message
	socket.on('send message',function(data){
		io.sockets.emit('new message',{msg: data, user: socket.username});
	});

	// New User
	socket.on('new user', function(data, callback){
		callback(true);
		console.log(data + " logged in.");
		socket.username = data;
		users.push(socket.username);
		updateUsernames(data, 'in');
	});


	function updateUsernames(data, status){
		io.sockets.emit('get users', users, data, status);
	}
});