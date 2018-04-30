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

app.get('/', function(req, res){
	res.sendFile(__dirname +  "/index.html")
});

io.sockets.on('connection', function (socket){
	connections.push(socket);
	console.log('Connected: %s sockets connected', connections.length);

	// Disconnect
	socket.on('disconnect', function(data){
		if(socket.username){
			users.splice(users.indexOf(socket.username), 1);
			updateUsernames();
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
		socket.username = data;
		users.push(socket.username);
		updateUsernames();
	});

	// Get ping
	socket.on('Ping_it', function(data){
		//console.log("Get pinged from: " + socket.username);
	});

	function updateUsernames(){
		io.sockets.emit('get users', users)
	}
});