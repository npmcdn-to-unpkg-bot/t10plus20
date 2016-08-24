var express = require('express')
	router = express.Router()

router.get('/', function(req, res, next) {
	res.render('satan')
})

module.exports = router