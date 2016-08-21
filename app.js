var express = require('express'), 
	app = express(), 
	stylus = require('stylus'), 
	nib = require('nib'),
	fs = require('fs'),
	path = require('path'),
	bodyParser = require('body-parser'),
	logger = require('morgan'), 
	cookieParser = require('cookie-parser'), 
	index = require('./routes/index');

app.set('port', (process.env.PORT || 8080))
app.set('views', __dirname + '/views')
app.set('view engine', 'jade')
app.use(logger('dev')) 

app.use(stylus.middleware({
	src: __dirname + '/resources',
	dest: __dirname + '/public',
	debug: true,
	force: true,
	compile: function compile(str, path) {
		console.log('Compiling stylus to css')
		return stylus(str) 
			.set('filename', path)
			.set('warn', true)
			.set('compress', true)
			.use(nib())
			.import('nib')
	}
}))

app.use('/', express.static(__dirname + '/public'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))
app.use(cookieParser())

app.use('/', index)

app.use(function(req, res, next) {
	var err = new Error('Not found')
	err.status = 404
	next(err)
})

module.exports = app