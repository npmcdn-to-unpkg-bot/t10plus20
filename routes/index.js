var express = require('express')
	router = express.Router()

router.get('/', function(req, res, next) {
	res.render('index', { title: 'T10+20' })
})

module.exports = router