var app = require('../app')
var http = require('http')
var debug = require('debug')('t10plus20:server')
var port = normalizePort(process.env.PORT || 8080)
app.set('port', port)

var server = http.createServer(app)

server.listen(port)
server.on('error', onError)
server.on('listening', onListening)

function normalizePort(val) {
	var port = parseInt(val, 10)
	if (isNaN(port)) {
		return val;
	}
	if (port >= 0) {
		return port
	}
	return false
}

function onError(error) {
	if (error.syscall !== 'listen') {
		throw error
	}
	var bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port

	switch (error.code) {
		case 'EACCES': 
			console.error(bind + ' requires elevated priviliges')
			process.exit(1)
			break
		case 'EADDRINUSE': 
			console.error(bind + ' is already in use')
			process.exit(1)
			break
		default: 
			throw error
	}
}

function onListening() {
	var addr = server.address()
	var bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port
	debug('Listening on ' + bind)
	console.log('App started on: ' + bind)
}