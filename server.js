var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);

users = [];
connections = [];

server.listen(process.env.PORT || 5000);
console.log('Server running...')

app.get('/', function(req, res){
	res.sendFile(__dirname +  "/index.html")
});

io.sockets.on('connection', function (socket){
	connections.push(socket);
	var address = String(socket.request.connection.remoteAddress);
	console.log('New connection from ' + address);

	// Disconnect
	socket.on('disconnect', function(){
		connections.splice(connections.indexOf(socket), 1);
		console.log('Disconnected: %s sockets disconnected', connections.length)
	});

	//Send Message
	socket.on('send message',function(data){
		io.sockets.emit('new message',{msg: data});
	});

});