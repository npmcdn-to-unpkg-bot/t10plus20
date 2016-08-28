var express = require('express'), 
	app = express(), 
	stylus = require('stylus'), 
	nib = require('nib'),
	fs = require('fs'),
	path = require('path'),
	bodyParser = require('body-parser'),
	logger = require('morgan'), 
	cookieParser = require('cookie-parser'), 
	index = require('./routes/index'), 
	satan = require('./routes/satan');

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
app.use(function(req, res, next) {
	// Set permissive CORS header - this allows this server to be used only as
    // an API server in conjunction with something like webpack-dev-server.
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
    // Disable caching so we'll always get the latest comments.
    res.setHeader('Cache-Control', 'no-cache')
    next()
})
app.use(cookieParser())

app.use('/', index)
app.use('/summonthegreatdemons', satan)

var COMMENTS_FILE = path.join(__dirname, 'comments.json')

app.get('/api/comments', function(req, res) {
	fs.readFile(COMMENTS_FILE, function(err, data) {
		if (err) {
			console.error(err)
			process.exit(1)
		}
		//res.send('success')
		res.json(JSON.parse(data))
	})
})

app.post('/api/comments', function(req, res) {
	fs.readFile(COMMENTS_FILE, function(err, data) {
		if (err) {
			console.error(err)
			process.exit(1)
		}
		var comments = JSON.parse(data)

		var newComment = {
			id: Date.now(), 
			author: req.body.author,
			text: req.body.text
		}
		comments.push(newComment)

		fs.writeFile(COMMENTS_FILE, JSON.stringify(comments, null, 4), function(err) {
			if (err) {
				console.error(err)
				process.exit(1)
			}
			res.json(comments)
		})
	})
})

app.use('/message', function(req, res, next) {
	//res.setHeader('Access-Control-Allow-Origin', '*')
	//res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
	//res.setHeader('Cache-Control', 'no-cache')
	res.sendFile('message/index.html')
})

app.use(function(req, res, next) {
	var err = new Error('Not found')
	err.status = 404
	next(err)
})

module.exports = app